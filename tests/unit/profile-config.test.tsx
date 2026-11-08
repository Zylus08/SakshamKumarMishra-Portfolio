import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { profile, configuredSocials, navigation } from "../../src/lib/profile";
import { createContactHandler } from "../../src/lib/contact/handler";
import { liveConfiguration } from "../../src/lib/contact/config";
test("supplied profiles are exact, valid and Codeforces stays hidden", () => {
  assert.deepEqual(profile.socials, {
    github: "https://github.com/Zylus08",
    linkedin: "https://www.linkedin.com/in/saksham-mishra-ml/",
    codeforces: "",
    leetcode: "https://leetcode.com/u/zylus08/",
    cses: "https://cses.fi/user/515838",
  });
  const links = configuredSocials();
  assert.equal(links.length, 4);
  assert.ok(!links.some((link) => link.platform === "codeforces"));
  for (const link of links) {
    assert.equal(link.url, profile.socials[link.platform]);
    assert.equal(new URL(link.url).protocol, "https:");
  }
  assert.deepEqual(
    navigation.map((n) => n.href),
    ["/", "/research", "/projects", "/writing", "/about"],
  );
});
test("recipient is configured as the inbox, never as sender; mock does not call the network", async () => {
  const example = fs.readFileSync(".env.example", "utf8");
  const env = Object.fromEntries(
    example
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );
  assert.equal(env.CONTACT_TO_EMAIL, "mishrasaksham080705@gmail.com");
  assert.equal(profile.email, env.CONTACT_TO_EMAIL);
  assert.equal(env.CONTACT_FROM_EMAIL, "");
  assert.equal(env.CONTACT_TRANSPORT, "mock");
  let calls = 0;
  const handler = createContactHandler({
    env,
    fetcher: async () => {
      calls++;
      throw new Error("Network prohibited");
    },
  });
  const response = await handler(
    new Request("https://sakshamkumarmishra.cv/api/contact", {
      method: "POST",
      headers: {
        origin: "https://sakshamkumarmishra.cv",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "fixture@example.test",
        subject: "Configuration test",
        message: "This is a mock-only test of the supplied inbox.",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).code, "mock");
  assert.equal(calls, 0);
  assert.throws(() =>
    liveConfiguration({ ...env, CONTACT_FROM_EMAIL: profile.email }),
  );
});
