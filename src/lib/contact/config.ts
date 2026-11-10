import { z } from "zod";
import { origin } from "../profile";
export type ContactEnvironment = Record<string, string | undefined>;
export function contactMode(
  env: ContactEnvironment = process.env,
): "mock" | "live" | "disabled" {
  const nonProduction =
    env.NODE_ENV === "development" ||
    env.NODE_ENV === "test" ||
    env.VERCEL_ENV === "preview" ||
    env.VERCEL_ENV === "development";
  // A copied production key must never turn previews or automated tests into senders.
  if (nonProduction && env.CONTACT_TRANSPORT === "resend") return "disabled";
  if (env.CONTACT_TRANSPORT === "mock") return "mock";
  if (env.CONTACT_TRANSPORT === "resend") return "live";
  return nonProduction && !env.CONTACT_TRANSPORT ? "mock" : "disabled";
}
export function allowedOrigins(env: ContactEnvironment) {
  return [
    origin,
    "https://www.sakshamkumarmishra.cv",
    ...(env.CONTACT_ALLOWED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter((value) => {
        try {
          return new URL(value).origin === value;
        } catch {
          return false;
        }
      }),
    ...(env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ];
}
export class ContactConfigurationError extends Error {
  constructor(public readonly fields: string[]) {
    super("Contact unavailable");
  }
}
export function liveConfiguration(env: ContactEnvironment) {
  const from = z.string().email().safeParse(env.CONTACT_FROM_EMAIL),
    to = z.string().email().safeParse(env.CONTACT_TO_EMAIL);
  const fields: string[] = [];
  const credential = (value: string | undefined) =>
    !!value?.trim() && !/[\r\n]/.test(value);
  if (!credential(env.RESEND_API_KEY)) fields.push("RESEND_API_KEY");
  if (
    !from.success ||
    !from.data.split("@")[1].toLowerCase().endsWith(".sakshamkumarmishra.cv")
  )
    fields.push("CONTACT_FROM_EMAIL");
  if (!to.success) fields.push("CONTACT_TO_EMAIL");
  if (!credential(env.UPSTASH_REDIS_REST_TOKEN))
    fields.push("UPSTASH_REDIS_REST_TOKEN");
  if ((env.CONTACT_RATE_LIMIT_SECRET?.trim().length || 0) < 32)
    fields.push("CONTACT_RATE_LIMIT_SECRET");
  let redis: URL | undefined;
  try {
    redis = new URL(env.UPSTASH_REDIS_REST_URL || "");
    if (
      redis.protocol !== "https:" ||
      redis.username ||
      redis.password ||
      redis.pathname !== "/" ||
      redis.search ||
      redis.hash
    )
      throw new Error();
  } catch {
    fields.push("UPSTASH_REDIS_REST_URL");
  }
  if (fields.length || !from.success || !to.success || !redis)
    throw new ContactConfigurationError(fields);
  return {
    from: from.data,
    to: to.data,
    key: env.RESEND_API_KEY!,
    redis: redis.origin,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
    secret: env.CONTACT_RATE_LIMIT_SECRET!,
  };
}

// Public readiness reports only a mode, never missing keys or credential values.
export function contactAvailability(env: ContactEnvironment = process.env) {
  const mode = contactMode(env);
  if (mode !== "live") return mode;
  try {
    liveConfiguration(env);
    return "live" as const;
  } catch {
    return "disabled" as const;
  }
}
