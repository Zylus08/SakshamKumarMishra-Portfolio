import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import {
  careerPathways,
  homepageProjectOrder,
} from "../src/lib/career-pathways";
import { documents } from "../src/lib/assets";
import manifest from "./fixtures/document-integrity.json";

test("career selections expose matching cases and authentic documents", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(
    /The pursuit of\s*understanding\./,
  );
  await expect(page.locator(".hero-intro > p")).toContainText(
    "quantitative systems",
  );
  await expect(page.locator(".hero-actions a[download]")).toHaveAttribute(
    "href",
    documents.find((d) => d.id === "quantitative")!.file!,
  );
  await expect(page.locator("main section")).toHaveCount(6);
  await expect(
    page
      .getByRole("navigation", {
        name: "Primary",
        exact: true,
        includeHidden: true,
      })
      .getByRole("link", { includeHidden: true }),
  ).toHaveCount(5);
  expect(
    await page
      .locator(".project-panel")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href"))),
  ).toEqual(homepageProjectOrder.map((slug) => `/projects/${slug}`));
  for (const pathway of careerPathways) {
    const tab = page.getByRole("tab", { name: pathway.label, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel", {
      name: pathway.label,
      exact: true,
    });
    await expect(panel).toBeVisible();
    expect(
      await panel
        .locator("li a")
        .evaluateAll((links) => links.map((a) => a.getAttribute("href"))),
    ).toEqual(pathway.slugs.map((slug) => `/${pathway.kind}/${slug}`));
    for (const slug of pathway.slugs)
      expect((await request.get(`/${pathway.kind}/${slug}`)).status()).toBe(
        200,
      );
    const doc = documents.find((d) => d.id === pathway.documentId)!;
    await expect(
      panel.getByRole("link", { name: `Download ${doc.title} (PDF)` }),
    ).toHaveAttribute("href", doc.file!);
    const response = await request.get(doc.file!);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect(
      createHash("sha256")
        .update(await response.body())
        .digest("hex"),
    ).toBe(manifest.find((item) => item.path === doc.file)!.sha256);
    await panel
      .getByRole("link", { name: pathway.moreLabel + " ↗", exact: true })
      .click();
    if (pathway.kind === "projects") {
      const category = new URL(
        pathway.moreHref,
        "https://example.test",
      ).searchParams.get("category")!;
      await expect(
        page.getByRole("button", { name: category, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      if (pathway.id === "quant")
        await expect(page.locator(".entry")).toHaveCount(7);
    } else await expect(page.locator(".entry")).toHaveCount(5);
    await page.goto("/");
  }
});

test("pathway keyboard navigation and archive history preserve filter behavior", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(
    page.getByRole("tabpanel", { name: "Research", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.first()).toBeFocused();
  await page.keyboard.press("Home");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("tabpanel", { name: "Quantitative Finance", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/tradecore$/);
  await page.goto("/projects?category=Quantitative%20Finance&source=career");
  await expect(page.locator(".entry")).toHaveCount(7);
  await page.getByLabel("Search projects").fill("RiskLab");
  await page
    .getByLabel("Filter projects status")
    .selectOption("Independent exploration");
  await expect(page.locator(".entry")).toHaveCount(1);
  await page.getByLabel("Search projects").fill("");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".entry")).toHaveCount(24);
  await expect(page).toHaveURL(/source=career/);
  await page.goBack();
  await expect(page.locator(".entry")).toHaveCount(7);
  await page.reload();
  await expect(page.locator(".entry")).toHaveCount(7);
  await page.goto("/projects?category=not-a-category");
  await expect(page.locator(".entry")).toHaveCount(24);
});

test("career composition is accessible in both themes at narrow and wide sizes", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const widths = info.project.name === "mobile" ? [320, 390] : [768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["dark", "light"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("skm-theme", value),
        theme,
      );
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `docs/assets/m4.1/hero-${width}-${theme}.png`,
      });
      const root = page.locator(".career-pathways");
      await root.scrollIntoViewIfNeeded();
      for (const pathway of careerPathways) {
        await page
          .getByRole("tab", { name: pathway.label, exact: true })
          .click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const scan = await new AxeBuilder({ page })
          .include(".career-pathways")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(scan.violations).toEqual([]);
      }
      await page
        .getByRole("tab", { name: "Quantitative Finance", exact: true })
        .click();
      await expect(root).toHaveCSS("animation-name", "none");
      // Fit the entire component below the sticky header for an unoccluded
      // component capture. Responsive assertions above use the 900px viewport.
      await page.setViewportSize({ width, height: 1800 });
      await root.evaluate((element) => {
        window.scrollTo({
          top: window.scrollY + element.getBoundingClientRect().top - 120,
          behavior: "instant",
        });
      });
      await root.screenshot({
        path: `docs/assets/m4.1/pathways-${width}-${theme}.png`,
      });
    }
  }
});
