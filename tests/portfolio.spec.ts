import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/research",
  "/projects",
  "/writing",
  "/about",
  "/research/h-star",
  "/research/eeg-representation",
  "/research/mobilelora",
  "/projects/project-janus",
  "/projects/hydra-stream",
  "/projects/tradecore",
];
test("all routes render, no overflow, accessible landmarks", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations, route).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test("navigation and six homepage acts", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator("main section")).toHaveCount(6);
  if (info.project.name === "mobile") {
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    await page
      .getByRole("navigation", { name: "Mobile", exact: true })
      .getByRole("link", { name: "Research" })
      .click();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link"),
    ).toHaveCount(5);
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Research", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/research$/);
});
test("search, category, view and research status controls", async ({
  page,
}) => {
  await page.goto("/projects");
  await page
    .getByRole("button", { name: "Systems & Infrastructure", exact: true })
    .click();
  await expect(page.locator(".entry")).toHaveCount(3);
  await expect(
    page.locator(".entry").filter({ hasText: "Kamish" }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search projects" })
    .fill("TradeCore");
  await expect(page.locator(".entry")).toHaveCount(1);
  await page.getByRole("button", { name: "Show grid view" }).click();
  await expect(page.locator(".entries")).toHaveClass(/grid/);
  await page
    .getByRole("textbox", { name: "Search projects" })
    .fill("no matching project");
  await expect(page.getByText("No entries here. Yet.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".entry")).toHaveCount(24);
  await page.goto("/research");
  await page
    .getByLabel("Filter research status")
    .selectOption("Verification pending");
  await expect(page.locator(".entry")).toHaveCount(2);
});
test("palette keyboard, focus restoration and navigation", async ({ page }) => {
  await page.goto("/");
  // The button interaction establishes hydration before testing the window shortcut.
  await page.getByRole("button", { name: "Open command palette" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("combobox");
  await expect(search).toBeFocused();
  await search.fill("Janus");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/project-janus$/);
  await page.getByRole("button", { name: "Open command palette" }).click();
  await search.fill("unknownzz");
  await expect(page.getByRole("status")).toContainText("No matches");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open command palette" }),
  ).toBeFocused();
});
test("theme persists and reduced motion disables transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page
      .locator(".hero-copy")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe("auto");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});
test("metadata, 404 and writing empty state", async ({ page, request }) => {
  await page.goto("/writing");
  await expect(page.getByText("No entries here. Yet.")).toBeVisible();
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://www.sakshamkumarmishra.cv/writing",
  );
  expect((await request.get("/missing-page")).status()).toBe(404);
  expect((await request.get("/research/missing")).status()).toBe(404);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
});
