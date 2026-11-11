import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getEntries } from "../src/lib/content";

test("quant category combines with search and status without losing the catalogue", async ({
  page,
}) => {
  await page.goto("/projects");
  await page
    .getByRole("button", { name: "Quantitative Finance", exact: true })
    .click();
  await expect(page.locator(".entry")).toHaveCount(7);
  await page
    .getByLabel("Filter projects status")
    .selectOption("Independent exploration");
  await page.getByRole("textbox", { name: "Search projects" }).fill("RiskLab");
  await expect(page.locator(".entry")).toHaveCount(1);
  await page.locator("a.entry").click();
  await expect(page).toHaveURL(/\/projects\/risklab$/);
  await expect(page.locator(".katex").first()).toBeVisible();
});

test("homepage curation and research cross-links remain bounded", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator('.project-stack a[href^="/projects/"]'),
  ).toHaveCount(7);
  await expect(page.locator("main section")).toHaveCount(6);
  await page.goto("/projects/thermodynamic-evolution");
  await expect(page.locator("h1")).toHaveText("Thermodynamic Evolution");
  await expect(page.locator(".diagram")).toBeVisible();
  await expect(page.locator(".diagram")).toContainText("Isolate and validate");
  await page
    .getByRole("link", { name: "semantic-analysis research note" })
    .click();
  await expect(page).toHaveURL(/\/research\/software-analysis$/);
  await page
    .getByRole("link", { name: "Thermodynamic Evolution case study" })
    .click();
  await expect(page).toHaveURL(/\/projects\/thermodynamic-evolution$/);
});

for (const entry of [...getEntries("projects"), ...getEntries("research")]) {
  test(`catalogue accessibility and responsive layout: ${entry.kind}/${entry.slug}`, async ({
    page,
  }, info) => {
    const response = await page.goto(`/${entry.kind}/${entry.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(entry.title);
    if (info.project.name === "desktop") {
      const article = await page.locator(".prose").boundingBox();
      const contents = await page.locator(".contents").boundingBox();
      expect(article?.width).toBeGreaterThan(600);
      expect(article!.x).toBeGreaterThan(contents!.x + contents!.width);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
  });
}
