import test from "node:test";
import assert from "node:assert/strict";
import { createContactHandler } from "../../src/lib/contact/handler";
import { contactAvailability, contactMode } from "../../src/lib/contact/config";
import type { ContactDiagnostic } from "../../src/lib/contact/diagnostics";

const env = {
  NODE_ENV: "production",
  VERCEL_ENV: "production",
  CONTACT_TRANSPORT: "resend",
  RESEND_API_KEY: "FAKE_RESEND_SECRET",
  CONTACT_FROM_EMAIL: "contact@updates.sakshamkumarmishra.cv",
  CONTACT_TO_EMAIL: "mishrasaksham080705@gmail.com",
  UPSTASH_REDIS_REST_URL: "https://redis.example.test",
  UPSTASH_REDIS_REST_TOKEN: "FAKE_REDIS_SECRET",
  CONTACT_RATE_LIMIT_SECRET: "fake-hmac-secret-with-at-least-32-characters",
};
const input = {
  name: "Private Visitor",
  email: "visitor@example.test",
  subject: "Research question",
  message: "Private message content for an isolated unit test.",
  website: "",
};
const request = (origin = "https://www.sakshamkumarmishra.cv", extra = {}) =>
  new Request(`${origin}/api/contact`, {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({ ...input, ...extra }),
  });
const noNetwork: typeof fetch = async () => {
  assert.fail("No network call allowed");
};

test("development, test and Vercel preview cannot send even with copied production settings", async () => {
  for (const context of [
    { NODE_ENV: "development" },
    { NODE_ENV: "test" },
    { VERCEL_ENV: "preview" },
    { VERCEL_ENV: "development" },
  ]) {
    const settings = { ...env, ...context };
    assert.equal(contactMode(settings), "disabled");
    assert.equal(
      (
        await createContactHandler({
          env: settings,
          fetcher: noNetwork,
          logger: () => {},
        })(request())
      ).status,
      503,
    );
    const mock = { ...settings, CONTACT_TRANSPORT: "mock" };
    const response = await createContactHandler({
      env: mock,
      fetcher: noNetwork,
    })(request());
    assert.equal((await response.json()).code, "mock");
  }
});

test("readiness is disabled for every missing live setting and never exposes credentials", async () => {
  assert.equal(contactAvailability(env), "live");
  for (const key of [
    "RESEND_API_KEY",
    "CONTACT_FROM_EMAIL",
    "CONTACT_TO_EMAIL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "CONTACT_RATE_LIMIT_SECRET",
  ]) {
    const settings = { ...env, [key]: "" };
    assert.equal(contactAvailability(settings), "disabled", key);
    const events: ContactDiagnostic[] = [];
    const response = await createContactHandler({
      env: settings,
      fetcher: noNetwork,
      logger: (e) => events.push(e),
    })(request());
    assert.equal(response.status, 503);
    assert.deepEqual(events[0].missingSettings, [key]);
    assert.ok(!JSON.stringify(events).includes("FAKE_RESEND_SECRET"));
    assert.ok(!(await response.text()).includes(key));
  }
});

test("malformed or whitespace-only credentials are rejected before network access", async () => {
  for (const change of [
    { RESEND_API_KEY: "   " },
    { RESEND_API_KEY: "key\r\nInjected: value" },
    { UPSTASH_REDIS_REST_TOKEN: "   " },
    { CONTACT_RATE_LIMIT_SECRET: " ".repeat(40) },
    { UPSTASH_REDIS_REST_URL: "https://redis.example.test/wrong-path" },
    { UPSTASH_REDIS_REST_URL: "https://user:secret@redis.example.test" },
  ]) {
    const events: ContactDiagnostic[] = [];
    const response = await createContactHandler({
      env: { ...env, ...change },
      fetcher: noNetwork,
      logger: (e) => events.push(e),
    })(request());
    assert.equal(response.status, 503);
    assert.equal(contactAvailability({ ...env, ...change }), "disabled");
    assert.ok(
      events[0].invalidSettings?.length || events[0].missingSettings?.length,
    );
    assert.ok(!JSON.stringify(events).includes("Injected"));
  }
});

test("apex and canonical www origins work while lookalikes are rejected", async () => {
  const handler = createContactHandler({
    env: { CONTACT_TRANSPORT: "mock" },
    fetcher: noNetwork,
  });
  for (const origin of [
    "https://sakshamkumarmishra.cv",
    "https://www.sakshamkumarmishra.cv",
  ])
    assert.equal((await handler(request(origin))).status, 200);
  for (const origin of [
    "https://www.sakshamkumarmishra.cv.evil.test",
    "http://www.sakshamkumarmishra.cv",
    "https://preview.example.test",
  ])
    assert.equal((await handler(request(origin))).status, 403);
});

test("production passes shared limiter before one mocked provider call and logs only safe identifiers", async () => {
  const calls: string[] = [],
    events: ContactDiagnostic[] = [];
  const providerId = "dacf4072-4119-4d88-932f-6202748ac7c8";
  const response = await createContactHandler({
    env,
    logger: (event) => events.push(event),
    fetcher: async (url, init) => {
      calls.push(String(url));
      if (url === env.UPSTASH_REDIS_REST_URL)
        return Response.json({ result: [1, 0] });
      assert.equal(url, "https://api.resend.com/emails");
      const payload = JSON.parse(String(init?.body));
      assert.deepEqual(payload.to, [env.CONTACT_TO_EMAIL]);
      assert.equal(payload.from, env.CONTACT_FROM_EMAIL);
      assert.equal(payload.reply_to, input.email);
      assert.equal(payload.subject, `[SKM Portfolio Inquiry] ${input.subject}`);
      return Response.json({ id: providerId });
    },
  })(request());
  assert.equal(response.status, 202);
  assert.deepEqual(calls, [
    env.UPSTASH_REDIS_REST_URL,
    "https://api.resend.com/emails",
  ]);
  assert.equal(events[0].providerId, providerId);
  assert.equal(
    events[0].requestId,
    response.headers.get("X-Contact-Request-Id"),
  );
  const serialized = JSON.stringify(events);
  for (const secret of [
    env.RESEND_API_KEY,
    env.UPSTASH_REDIS_REST_TOKEN,
    env.CONTACT_RATE_LIMIT_SECRET,
    input.email,
    input.message,
    input.name,
  ])
    assert.ok(!serialized.includes(secret));
});

test("provider rejection, invalid acknowledgement and network errors cannot produce false acceptance or leak errors", async () => {
  const cases: [typeof fetch, string][] = [
    [
      async () =>
        Response.json({ error: "FAKE_RESEND_SECRET" }, { status: 403 }),
      "provider_rejected",
    ],
    [async () => Response.json({ id: "   " }), "provider_invalid_ack"],
    [async () => new Response("invalid JSON"), "provider_invalid_ack"],
    [
      async () => {
        throw new Error("FAKE_REDIS_SECRET");
      },
      "provider_network",
    ],
  ];
  for (const [fetcher, expected] of cases) {
    const events: ContactDiagnostic[] = [];
    const response = await createContactHandler({
      env,
      fetcher,
      limit: async () => ({ allowed: true, retryAfter: 0 }),
      logger: (e) => events.push(e),
    })(request());
    assert.equal(response.status, 502);
    assert.equal(events[0].event, expected);
    const text = await response.text();
    assert.ok(!text.includes('"code":"accepted"'));
    assert.ok(!(text + JSON.stringify(events)).includes("FAKE_"));
  }
});

test("invalid sender settings fail closed and logging failure cannot change accepted outcome", async () => {
  for (const from of [
    "sender@gmail.com",
    "sender@sakshamkumarmishra.cv",
    "sender@updates.sakshamkumarmishra.cv\r\nBcc:attacker@example.test",
    "Name <contact@updates.sakshamkumarmishra.cv>",
  ]) {
    const response = await createContactHandler({
      env: { ...env, CONTACT_FROM_EMAIL: from },
      fetcher: noNetwork,
      logger: () => {},
    })(request());
    assert.equal(response.status, 503);
  }
  const response = await createContactHandler({
    env,
    fetcher: async () => Response.json({ id: "mock-id" }),
    limit: async () => ({ allowed: true, retryAfter: 0 }),
    logger: () => {
      throw new Error("logging failed");
    },
  })(request());
  assert.equal(response.status, 202);
});

test("shared rate limit denial and service failure never call the provider", async () => {
  for (const fail of [false, true]) {
    const calls: string[] = [],
      events: ContactDiagnostic[] = [];
    const response = await createContactHandler({
      env,
      logger: (e) => events.push(e),
      fetcher: async (url) => {
        calls.push(String(url));
        if (fail) throw new Error("FAKE_REDIS_SECRET");
        return Response.json({ result: [0, 90] });
      },
    })(request());
    assert.equal(response.status, fail ? 503 : 429);
    assert.deepEqual(calls, [env.UPSTASH_REDIS_REST_URL]);
    assert.equal(events[0].event, fail ? "limiter_error" : "rate_limited");
    if (!fail) assert.equal(response.headers.get("retry-after"), "90");
  }
});
