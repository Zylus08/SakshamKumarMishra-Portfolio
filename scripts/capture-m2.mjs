import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  for (const [name, path] of [
    ["home", "/"],
    ["about", "/about"],
    ["contact", "/contact"],
  ]) {
    await page.goto("http://127.0.0.1:3000" + path);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `artifacts/m2-${name}-desktop.png`,
      fullPage: true,
    });
  }
  await page.locator(".resume-menu summary").click();
  await page.screenshot({ path: "artifacts/m2-resume-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000/contact");
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: "artifacts/m2-contact-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.screenshot({
    path: "artifacts/m2-contact-light-mobile.png",
    fullPage: true,
  });
} finally {
  await browser.close();
}
