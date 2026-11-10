import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getEntries } from "../src/lib/content";
import { articleHeadings } from "../src/lib/article-headings";
import sourceManifest from "./fixtures/public-source-links.json";

const featured = [
  ...getEntries("projects")
    .filter((e) => e.featured)
    .slice(0, 7),
  ...getEntries("research")
    .filter((e) => e.featured)
    .slice(0, 3),
];
const sources = new Set(sourceManifest.links.map((item) => item.url));

test("all ten homepage features open their actual articles and section anchors", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `docs/assets/m3.1/home-${info.project.name}.png`,
  });
  for (const entry of featured) {
    await page.goto("/");
    const route = `/${entry.kind}/${entry.slug}`;
    await page.locator(`main a[href="${route}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator("h1")).toHaveText(entry.title);
    const headings = articleHeadings(entry.body);
    await expect(
      page
        .getByRole("navigation", { name: "Article sections" })
        .getByRole("link"),
    ).toHaveCount(headings.length);
    for (const heading of headings) {
      await expect(page.locator(`[id="${heading.id}"]`)).toHaveCount(1);
    }
    const links = await page
      .locator('.prose a[href*="github.com/"]')
      .evaluateAll((elements) =>
        elements.map((element) => (element as HTMLAnchorElement).href),
      );
    for (const href of links) {
      expect(new URL(href).protocol).toBe("https:");
      if (href.includes("/blob/")) expect(sources.has(href), href).toBe(true);
    }
  }
  for (const collection of ["projects", "research"]) {
    await page.goto(`/${collection}`);
    await page.screenshot({
      path: `docs/assets/m3.1/${collection}-${info.project.name}.png`,
    });
  }
});

test("long-form keyboard anchors, active section, math, code, and diagrams", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/flowstate");
  const nav = page.getByRole("navigation", { name: "Article sections" });
  const last = nav.getByRole("link").last();
  const href = await last.getAttribute("href");
  await last.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(last).toHaveAttribute("aria-current", "location");
  const top = await page
    .locator(href!)
    .evaluate((element) => element.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(95);
  await expect(page.locator(".katex").first()).toBeAttached();
  await expect(page.locator("pre code").first()).toHaveAttribute(
    "class",
    /language-/,
  );
  await expect(page.locator(".diagram figcaption")).toContainText(/./);
  await expect(page.locator(".diagram span")).not.toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("reading width, responsive tables, themes, accessibility, and stable article layout", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const state = window as typeof window & { articleShift: number };
    state.articleShift = 0;
    new PerformanceObserver((list) => {
      for (const item of list.getEntries()) {
        const shift = item as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };
        if (!shift.hadRecentInput) state.articleShift += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(
      (value) => localStorage.setItem("skm-theme", value),
      theme,
    );
    await page.goto("/research/chess-evaluation");
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    const article = page.locator(".prose");
    const box = await article.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(740);
    if (info.project.name === "desktop")
      expect(box!.width).toBeGreaterThan(600);
    const table = page.getByRole("region", {
      name: "Scrollable article table",
    });
    await table.scrollIntoViewIfNeeded();
    await table.focus();
    await expect(table).toBeFocused();
    if (info.project.name === "mobile") {
      expect(
        await table.evaluate(
          (element) => element.scrollWidth > element.clientWidth,
        ),
      ).toBe(true);
      await page.keyboard.press("ArrowRight");
      await expect
        .poll(() => table.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    const before = await article.boundingBox();
    await page.waitForTimeout(400); // Bounded observation after font/layout settlement.
    const after = await article.boundingBox();
    expect(Math.abs(before!.width - after!.width)).toBeLessThan(1);
    expect(Math.abs(before!.height - after!.height)).toBeLessThan(1);
    expect(
      await page.evaluate(
        () => (window as typeof window & { articleShift: number }).articleShift,
      ),
    ).toBeLessThan(0.1);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
    await page.screenshot({
      path: `docs/assets/m3.1/chess-${info.project.name}-${theme}.png`,
      fullPage: false,
    });
  }
  await page.goto("/projects/flowstate#architecture-and-event-order");
  await page.screenshot({
    path: `docs/assets/m3.1/flowstate-${info.project.name}.png`,
    fullPage: false,
  });
});
