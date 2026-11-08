import { test } from "node:test";
import assert from "node:assert/strict";
import { createContactHandler } from "../../src/lib/contact/handler";
import { notification, sendResend } from "../../src/lib/contact/transport";
import { contactSchema, MAX_BODY_BYTES } from "../../src/lib/contact/schema";
import {
  memoryRateLimiter,
  rateKeys,
  sharedRateLimit,
} from "../../src/lib/contact/rate-limit";
import { contactMode, liveConfiguration } from "../../src/lib/contact/config";
const origin = "https://sakshamkumarmishra.cv";
const input = {
  email: "visitor@example.test",
  subject: "Research discussion",
  message: "I would like to discuss a research question.",
  name: "Visitor",
  website: "",
};
const mockEnv = { CONTACT_TRANSPORT: "mock", NODE_ENV: "production" };
const liveEnv = {
  ...mockEnv,
  CONTACT_TRANSPORT: "resend",
  RESEND_API_KEY: "unit-test-key-not-real",
  CONTACT_FROM_EMAIL: "contact@updates.sakshamkumarmishra.cv",
  CONTACT_TO_EMAIL: "owner@example.test",
  UPSTASH_REDIS_REST_URL: "https://redis.example.test",
  UPSTASH_REDIS_REST_TOKEN: "unit-test-redis-not-real",
  CONTACT_RATE_LIMIT_SECRET: "unit-test-secret-that-is-long-enough",
};
function request(body: unknown = input, headers: Record<string, string> = {}) {
  return new Request(origin + "/api/contact", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
const noNetwork: typeof fetch = async () => {
  throw new Error("Unexpected network request in test");
};
test("missing required fields and invalid email are rejected", async () => {
  const handler = createContactHandler({ env: mockEnv, fetcher: noNetwork });
  for (const body of [
    {},
    { ...input, email: "invalid" },
    { ...input, subject: "a" },
    { ...input, message: "short" },
  ])
    assert.equal((await handler(request(body))).status, 400);
});
test("bounds and header controls reject oversized fields and injection", () => {
  for (const body of [
    { ...input, email: "x@example.test\r\nBcc: other@example.test" },
    { ...input, subject: "x\r\nInjected: yes" },
    { ...input, subject: "s".repeat(161) },
    { ...input, message: "m".repeat(5001) },
    { ...input, name: "n".repeat(81) },
  ])
    assert.equal(contactSchema.safeParse(body).success, false);
});
test("body limit checks content-length and actual streamed bytes", async () => {
  const handler = createContactHandler({ env: mockEnv });
  assert.equal(
    (
      await handler(
        request(input, { "Content-Length": String(MAX_BODY_BYTES + 1) }),
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handler(
        request({ ...input, message: "x".repeat(MAX_BODY_BYTES + 1) }),
      )
    ).status,
    413,
  );
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(MAX_BODY_BYTES));
      controller.enqueue(new Uint8Array(1));
      controller.close();
    },
  });
  const streamed = new Request(origin + "/api/contact", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: stream,
    duplex: "half",
  } as RequestInit);
  assert.equal((await handler(streamed)).status, 413);
});
test("malformed JSON and content types fail safely", async () => {
  const handler = createContactHandler({ env: mockEnv });
  assert.equal(
    (await handler(request(input, { "Content-Type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (
      await handler(
        new Request(origin, {
          method: "POST",
          headers: { origin, "Content-Type": "application/json" },
          body: "{bad",
        }),
      )
    ).status,
    400,
  );
});
test("origin checks reject missing, hostile and cross-site origins", async () => {
  const handler = createContactHandler({ env: mockEnv });
  const cases: Record<string, string>[] = [
    { origin: "" },
    { origin: "https://evil.example" },
    { "sec-fetch-site": "cross-site" },
  ];
  for (const headers of cases)
    assert.equal((await handler(request(input, headers))).status, 403);
  assert.equal(
    (await handler(new Request(origin, { method: "GET" }))).status,
    405,
  );
});
test("honeypot rejects without contacting provider", async () => {
  assert.equal(
    (
      await createContactHandler({ env: liveEnv, fetcher: noNetwork })(
        request({ ...input, website: "bot" }),
      )
    ).status,
    400,
  );
});
test("unconfigured production fails closed; mock is explicit", async () => {
  assert.equal(contactMode({ NODE_ENV: "production" }), "disabled");
  assert.equal(contactMode({ NODE_ENV: "development" }), "mock");
  for (const env of [
    { NODE_ENV: "production" },
    { CONTACT_TRANSPORT: "resend" },
  ]) {
    const response = await createContactHandler({ env, fetcher: noNetwork })(
      request(),
    );
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "unconfigured");
  }
});
test("live configuration requires sending subdomain, safe addresses and shared limiter", () => {
  for (const changes of [
    { CONTACT_FROM_EMAIL: "sender@gmail.com" },
    { CONTACT_FROM_EMAIL: "sender@sakshamkumarmishra.cv" },
    {
      CONTACT_FROM_EMAIL: "sender@updates.sakshamkumarmishra.cv\nBcc:x@y.test",
    },
    { CONTACT_TO_EMAIL: "not-email" },
    { UPSTASH_REDIS_REST_URL: "http://redis.example.test" },
    { CONTACT_RATE_LIMIT_SECRET: "short" },
  ])
    assert.throws(() => liveConfiguration({ ...liveEnv, ...changes }));
  assert.equal(liveConfiguration(liveEnv).from, liveEnv.CONTACT_FROM_EMAIL);
});
test("mock validates honestly without any external transmission", async () => {
  const response = await createContactHandler({
    env: mockEnv,
    fetcher: noNetwork,
  })(request());
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.code, "mock");
  assert.match(data.message, /No email was sent/);
});
test("provider acceptance uses fixed recipient/sender, visitor Reply-To and timestamp", async () => {
  let sent: Record<string, unknown> | undefined;
  const fetcher: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    sent = JSON.parse(String(init?.body));
    return Response.json({ id: "mock-provider-ack" });
  };
  const response = await createContactHandler({
    env: liveEnv,
    fetcher,
    limit: async () => ({ allowed: true, retryAfter: 0 }),
    now: () => new Date("2026-11-08T06:00:00Z"),
  })(request());
  assert.equal(response.status, 202);
  assert.equal(sent?.from, liveEnv.CONTACT_FROM_EMAIL);
  assert.deepEqual(sent?.to, [liveEnv.CONTACT_TO_EMAIL]);
  assert.equal(sent?.reply_to, input.email);
  assert.match(String(sent?.text), /2026-11-08T06:00:00.000Z/);
  assert.match((await response.json()).message, /not yet confirmed/);
});
test("arbitrary recipient and sender fields are rejected, never forwarded", async () => {
  const handler = createContactHandler({ env: liveEnv, fetcher: noNetwork });
  for (const extra of [
    { to: "attacker@example.test" },
    { from: "visitor@example.test" },
    { reply_to: "attacker@example.test" },
    { html: "<script>evil</script>" },
  ])
    assert.equal((await handler(request({ ...input, ...extra }))).status, 400);
});
test("HTML escapes user data while plain text remains literal", () => {
  const dangerous = {
    ...input,
    subject: "<b>subject</b>",
    message: '<script>alert("x")</script> & <img src=x onerror=evil()>',
    name: "<Name's>",
  };
  const email = notification(dangerous, "2026-11-08");
  assert.ok(!email.html.includes("<script>"));
  assert.ok(!email.html.includes("<img"));
  assert.ok(email.html.includes("&lt;script&gt;"));
  assert.ok(email.html.includes("&amp;"));
  assert.ok(email.html.includes("&#39;"));
  assert.ok(email.text.includes(dangerous.message));
});
test("provider errors, missing ack and timeouts return generic failure", async () => {
  for (const fetcher of [
    async () =>
      Response.json({ secret: "PRIVATE_PROVIDER_ERROR" }, { status: 500 }),
    async () => Response.json({}),
    async () => {
      throw new Error("PRIVATE_PROVIDER_ERROR");
    },
  ]) {
    const response = await createContactHandler({
      env: liveEnv,
      fetcher: fetcher as typeof fetch,
      limit: async () => ({ allowed: true, retryAfter: 0 }),
    })(request());
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes("PRIVATE_PROVIDER_ERROR"));
  }
});
test("mock limiter allows three per email, then returns Retry-After", async () => {
  const handler = createContactHandler({ env: mockEnv, fetcher: noNetwork });
  for (let i = 0; i < 3; i++)
    assert.equal((await handler(request())).status, 200);
  const response = await handler(request());
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
});
test("rate window expires and aggregate limit applies across emails", async () => {
  const limit = memoryRateLimiter();
  const keys = ["global", "email"];
  for (let i = 0; i < 3; i++)
    assert.equal((await limit(keys, 0)).allowed, true);
  assert.equal((await limit(keys, 100)).allowed, false);
  assert.equal((await limit(keys, 3600001)).allowed, true);
  const global = memoryRateLimiter();
  for (let i = 0; i < 30; i++)
    assert.equal((await global(["all", `email-${i}`], 0)).allowed, true);
  assert.equal((await global(["all", "new-email"], 1)).allowed, false);
});
test("limiter stores HMACs, ignores untrusted forwarding headers", () => {
  const req = request(input, {
    "x-forwarded-for": "192.0.2.1",
    "x-vercel-forwarded-for": "192.0.2.2",
  });
  const keys = rateKeys(
    input.email,
    req,
    liveEnv.CONTACT_RATE_LIMIT_SECRET,
    {},
  );
  assert.equal(keys.length, 2);
  assert.ok(!keys.join().includes(input.email));
  const vercel = rateKeys(input.email, req, liveEnv.CONTACT_RATE_LIMIT_SECRET, {
    VERCEL: "1",
  });
  assert.equal(vercel.length, 3);
  assert.ok(!vercel.join().includes("192.0.2.2"));
});
test("shared limiter uses atomic EVAL and interprets responses", async () => {
  for (const allowed of [true, false]) {
    const fetcher: typeof fetch = async (_url, init) => {
      const command = JSON.parse(String(init?.body));
      assert.equal(command[0], "EVAL");
      assert.match(command[1], /EXPIRE/);
      assert.deepEqual(command.slice(2), [2, "global", "email", 3600, 30, 3]);
      return Response.json({ result: [allowed ? 1 : 0, allowed ? 0 : 60] });
    };
    assert.equal(
      (
        await sharedRateLimit(
          ["global", "email"],
          { redis: "https://redis.example.test", token: "fake" },
          fetcher,
        )
      ).allowed,
      allowed,
    );
  }
});
test("shared limiter failure never falls back to memory or sends", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    return Response.json({ error: "private" }, { status: 500 });
  };
  const response = await createContactHandler({ env: liveEnv, fetcher })(
    request(),
  );
  assert.equal(response.status, 503);
  assert.equal(calls, 1);
});
test("transport sets a timeout and authenticates server-side only", async () => {
  await sendResend(
    {
      from: liveEnv.CONTACT_FROM_EMAIL,
      to: [liveEnv.CONTACT_TO_EMAIL],
      reply_to: input.email,
      subject: "Test",
      ...notification(input, "now"),
    },
    "test-key",
    async (_url, init) => {
      assert.ok(init?.signal);
      assert.equal(
        new Headers(init?.headers).get("Authorization"),
        "Bearer test-key",
      );
      return Response.json({ id: "mock" });
    },
  );
});
