import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:3000");
await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
await browser.close();
fs.writeFileSync(
  "artifacts/preview-captured.txt",
  "Desktop 1440×1000 and mobile 390×844 screenshots captured.",
);
