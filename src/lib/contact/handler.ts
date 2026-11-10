import { randomBytes, randomUUID } from "node:crypto";
import { contactSchema, MAX_BODY_BYTES } from "./schema";
import {
  allowedOrigins,
  contactMode,
  liveConfiguration,
  ContactConfigurationError,
  type ContactEnvironment,
} from "./config";
import {
  notification,
  sendResend,
  mockTransport,
  ContactProviderError,
} from "./transport";
import {
  logContact,
  type ContactLogger,
  type ContactDiagnostic,
} from "./diagnostics";
import {
  memoryRateLimiter,
  rateKeys,
  sharedRateLimit,
  type LimitResult,
} from "./rate-limit";
type Dependencies = {
  env?: ContactEnvironment;
  fetcher?: typeof fetch;
  limit?: (keys: string[]) => Promise<LimitResult>;
  now?: () => Date;
  logger?: ContactLogger;
};
function result(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  return Response.json(
    { code, message, ...extra },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}
async function boundedBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new RangeError();
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(chunk.value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}
export function createContactHandler(dependencies: Dependencies = {}) {
  const env = dependencies.env || process.env,
    fetcher = dependencies.fetcher || fetch,
    memory = memoryRateLimiter(),
    mockSecret = randomBytes(32).toString("hex");
  return async (request: Request): Promise<Response> => {
    const requestId = randomUUID();
    const report = (
      event: ContactDiagnostic["event"],
      details: Omit<ContactDiagnostic, "event" | "requestId"> = {},
    ) => {
      try {
        (dependencies.logger || logContact)({ event, requestId, ...details });
      } catch {
        /* Logging must not change an already determined delivery outcome. */
      }
    };
    const reply = (...args: Parameters<typeof result>) => {
      const response = result(...args);
      response.headers.set("X-Contact-Request-Id", requestId);
      return response;
    };
    if (request.method !== "POST")
      return result(405, "method", "Use POST.", {}, { Allow: "POST" });
    if (
      !allowedOrigins(env).includes(request.headers.get("origin") || "") ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return result(403, "origin", "This request could not be verified.");
    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
      "application/json"
    )
      return result(415, "format", "Send a JSON request.");
    let raw: unknown;
    try {
      raw = JSON.parse(await boundedBody(request));
    } catch (error) {
      return error instanceof RangeError
        ? result(413, "size", "The message is too large.")
        : result(400, "invalid", "Check the form and try again.");
    }
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success)
      return result(400, "validation", "Please check the highlighted fields.", {
        errors: parsed.error.flatten().fieldErrors,
      });
    if (parsed.data.website)
      return result(400, "rejected", "The request could not be accepted.");
    const mode = contactMode(env);
    if (mode === "disabled") {
      report("disabled");
      return reply(
        503,
        "unconfigured",
        "Message sending is not configured yet. Please try again later.",
      );
    }
    let config: ReturnType<typeof liveConfiguration> | undefined;
    try {
      if (mode === "live") config = liveConfiguration(env);
    } catch (error) {
      report("configuration_error", {
        invalidSettings:
          error instanceof ContactConfigurationError
            ? error.fields.filter((name) => !!env[name]?.trim())
            : [],
        missingSettings: [
          "RESEND_API_KEY",
          "CONTACT_FROM_EMAIL",
          "CONTACT_TO_EMAIL",
          "UPSTASH_REDIS_REST_URL",
          "UPSTASH_REDIS_REST_TOKEN",
          "CONTACT_RATE_LIMIT_SECRET",
        ].filter((name) => !env[name]?.trim()),
      });
      return reply(
        503,
        "unconfigured",
        "Message sending is not configured yet. Please try again later.",
      );
    }
    const keys = rateKeys(
      parsed.data.email,
      request,
      config?.secret || mockSecret,
      env,
    );
    try {
      const limit = await (dependencies.limit
        ? dependencies.limit(keys)
        : config
          ? sharedRateLimit(keys, config, fetcher)
          : memory(keys));
      if (!limit.allowed) {
        report("rate_limited");
        return reply(
          429,
          "rate_limited",
          "Too many requests. Please wait before trying again.",
          { retryAfter: limit.retryAfter },
          { "Retry-After": String(limit.retryAfter) },
        );
      }
    } catch {
      report("limiter_error");
      return reply(
        503,
        "unavailable",
        "Message sending is temporarily unavailable. Please try again later.",
      );
    }
    if (mode === "mock") {
      await mockTransport();
      return reply(
        200,
        "mock",
        "Test submission validated. No email was sent; real delivery is not configured.",
      );
    }
    const input = parsed.data;
    try {
      const acknowledgement = await sendResend(
        {
          from: config!.from,
          to: [config!.to],
          reply_to: input.email,
          subject: `[SKM Portfolio Inquiry] ${input.subject}`,
          ...notification(
            input,
            (dependencies.now?.() || new Date()).toISOString(),
          ),
        },
        config!.key,
        fetcher,
      );
      report("provider_accepted", {
        // Resend IDs are UUIDs. Never log arbitrary provider response strings.
        ...(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
          acknowledgement.id,
        )
          ? { providerId: acknowledgement.id }
          : {}),
      });
      return reply(
        202,
        "accepted",
        "Accepted by the email provider. Delivery to the inbox is not yet confirmed.",
      );
    } catch (error) {
      report(
        error instanceof ContactProviderError
          ? `provider_${error.reason}`
          : "provider_network",
        {
          ...(error instanceof ContactProviderError && error.status
            ? { providerStatus: error.status }
            : {}),
        },
      );
      return reply(
        502,
        "failed",
        "The provider could not confirm acceptance. Please try again later.",
      );
    }
  };
}
