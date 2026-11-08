import { defineConfig, devices } from "@playwright/test";
const testPort = Number(process.env.SKM_TEST_PORT || "3000");
if (!Number.isInteger(testPort) || testPort < 1024 || testPort > 65535)
  throw new Error("Invalid SKM_TEST_PORT");
const baseURL = `http://127.0.0.1:${testPort}`;
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 120000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    channel: process.env.PLAYWRIGHT_CHANNEL,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    env: {
      CONTACT_TRANSPORT: "mock",
      CONTACT_ALLOWED_ORIGINS: baseURL,
      RESEND_API_KEY: "",
      CONTACT_TO_EMAIL: "",
      CONTACT_FROM_EMAIL: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
    },
    command: `npm run start -- --hostname 127.0.0.1 --port ${testPort}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
