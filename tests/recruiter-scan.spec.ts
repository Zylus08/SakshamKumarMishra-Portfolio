import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  careerPathways,
  homepageProjectOrder,
} from "../src/lib/career-pathways";
import { experienceHighlights } from "../src/lib/experience";
import {
  canonicalOrigin,
  siteTitle,
  siteDescription,
} from "../src/lib/site-metadata";

test("experience, Quant ordering and evidence hierarchy remain distinct from pathway navigation", async ({
  page,
}) => {
  await page.goto("/");
  const strip = page.getByRole("list", { name: "Education and experience" });
  await expect(strip.getByRole("listitem")).toHaveCount(4);
  for (const item of experienceHighlights)
    await expect(strip).toContainText(
      `${item.institution}${item.role}${item.dates}`,
    );
  await expect(strip).toContainText("expected June 2028");
  expect(
    await page
      .locator(".project-panel")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href"))),
  ).toEqual(homepageProjectOrder.map((s) => `/projects/${s}`));
  await expect(page.locator(".project-panel .proof-point")).toHaveCount(7);
  await expect(page.locator(".research-row .proof-point")).toHaveCount(3);
  await expect(page.locator(".research-row .status")).toHaveCount(3);
  const previews = await page
    .locator(
      ".project-copy > p:not(.micro):not(.proof-point), .research-row > div > p:not(.micro):not(.proof-point)",
    )
    .allTextContents();
  for (const p of careerPathways) {
    await page.getByRole("tab", { name: p.label, exact: true }).click();
    const panel = page.getByRole("tabpanel", { name: p.label, exact: true });
    for (const text of await panel
      .locator(".career-reading p")
      .allTextContents())
      expect(previews).not.toContain(text);
    await expect(
      panel.getByRole("link", { name: /Download.*PDF/ }),
    ).toHaveCount(1);
  }
  await strip.getByRole("link").first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#journey$/);
  await expect(page.locator(".journey-event")).toHaveCount(11);
  await expect(page.locator("main section")).toHaveCount(6);
});

test("recruiter metadata, OG image, canonical host and historical Kamish URL agree", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(siteTitle);
  await expect(page.locator("meta[name=description]")).toHaveAttribute(
    "content",
    siteDescription,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    siteTitle,
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    siteDescription,
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    siteTitle,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    canonicalOrigin, // Next serializes the root canonical without a trailing slash.
  );
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  const bytes = await og.body();
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  const legacy = await request.get("/projects/hydra-stream", {
    maxRedirects: 0,
  });
  expect(legacy.status()).toBe(200); // Stable route retained; no cosmetic rename/redirect needed.
  await page.goto("/projects/hydra-stream");
  await expect(page.locator("h1")).toHaveText("Kamish");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Kamish",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    canonicalOrigin + "/projects/hydra-stream",
  );
  await expect(page.locator(".prose")).toContainText(
    "older Hydra Stream name for link continuity",
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(canonicalOrigin + "/projects/hydra-stream");
  expect(sitemap).not.toContain("https://sakshamkumarmishra.cv");
  expect(sitemap).not.toContain("/research/h-star");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    canonicalOrigin + "/sitemap.xml",
  );
  await page.goto("/research/h-star");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("recruiter scan is readable in both themes at 320px and larger with reduced motion", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of info.project.name === "mobile" ? [320, 390] : [768, 1440])
    for (const theme of ["dark", "light"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("skm-theme", value),
        theme,
      );
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const strip = page.locator(".experience-strip");
      await strip.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const scan = await new AxeBuilder({ page })
        .include(".hero")
        .include(".engineering")
        .include(".research-section")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(scan.violations).toEqual([]);
      await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
      const start = await strip.boundingBox();
      await page.locator(".project-panel").first().scrollIntoViewIfNeeded();
      const end = await strip.boundingBox();
      expect(Math.abs(start!.height - end!.height)).toBeLessThan(1);
    }
});
