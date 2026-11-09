import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("gallery expansion, search, selection and browser history share one state", async ({
  page,
}, info) => {
  await page.goto("/writing?source=gallery-test");
  const gallery = page.locator(".category-covers");
  const cards = gallery.getByRole("button");
  await expect(gallery).toHaveAttribute("data-active", "false");
  const widths = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().width),
  );
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(2);
  await gallery.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({
    origin: performance.timeOrigin,
    scroll: scrollY,
  }));
  await cards.nth(0).click();
  await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/source=gallery-test&category=Poetry/);
  await expect(page.locator(".result-count")).toContainText(
    "Poetry / 0 entries",
  );
  await expect(page.locator("#writing-results .empty")).toContainText(
    "No entries here. Yet.",
  );
  await expect(cards.nth(1).locator("img")).toHaveCSS(
    "filter",
    "grayscale(0.8) brightness(0.72)",
  );
  await expect(cards.nth(0).locator("img")).toHaveCSS("filter", "none");
  if (info.project.name === "desktop") {
    await expect
      .poll(async () => {
        const a = await cards.nth(0).boundingBox(),
          b = await cards.nth(1).boundingBox();
        return a!.width / b!.width;
      })
      .toBeGreaterThan(2);
    const a = await cards.nth(0).boundingBox(),
      b = await cards.nth(1).boundingBox();
    expect(a!.width / b!.width).toBeLessThan(2.5);
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - before.scroll),
    ).toBeLessThan(4);
  } else {
    expect(
      await gallery.evaluate((el) => el.scrollWidth > el.clientWidth),
    ).toBe(true);
    expect((await cards.nth(0).boundingBox())!.width).toBeGreaterThan(200);
  }
  const historyLength = await page.evaluate(() => history.length);
  await cards.nth(0).click();
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  await page
    .getByRole("textbox", { name: "Search writing" })
    .fill("remember this search");
  await cards.nth(1).scrollIntoViewIfNeeded();
  await cards.nth(1).click();
  await expect(
    page.getByRole("textbox", { name: "Search writing" }),
  ).toHaveValue("remember this search");
  await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "true");
  await page.goBack();
  await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(before.origin);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(gallery).toHaveAttribute("data-active", "false");
  await expect(page).toHaveURL(/\/writing\?source=gallery-test$/);
});

test("deep links, keyboard, reduced motion and gallery themes", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/writing?category=Research+Notes");
  const gallery = page.locator(".category-covers");
  await expect(
    page.getByRole("button", { name: "Browse Research Notes", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Browse Poetry", exact: true })
    .focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Poetry", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  const reflections = page.getByRole("button", {
    name: "Browse Personal Reflections",
    exact: true,
  });
  await expect(reflections).toBeFocused();
  if (info.project.name === "mobile") {
    await expect
      .poll(async () => {
        const card = await reflections.boundingBox(),
          strip = await gallery.boundingBox();
        return (
          card!.x >= strip!.x &&
          card!.x + card!.width <= strip!.x + strip!.width
        );
      })
      .toBe(true);
  }
  await expect(reflections).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(reflections).toHaveAttribute("aria-pressed", "true");
  await expect(reflections).toHaveCSS("transition-duration", "0s");
  await expect(page.locator(".writing-result-transition")).toHaveCSS(
    "animation-name",
    "none",
  );
  for (const theme of ["dark", "light"] as const) {
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light theme" }).click();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await gallery.screenshot({
      path: `artifacts/milestone-2.3/${info.project.name}-gallery-${theme}.png`,
    });
  }
  await page.goto("/writing?category=not-a-category");
  await expect(gallery).toHaveAttribute("data-active", "false");
});

test("hero swaps authentic portrait and asterisk; both editorial redirects navigate", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.locator(".hero-heading .photo-compact img"),
  ).toHaveAttribute("src", /formal-headshot/);
  await expect(page.locator(".hero-intro .hero-asterisk")).toHaveText("✳");
  await expect(page.locator(".hero h1 .hero-asterisk")).toHaveCount(0);
  await expect(page.locator(".hero-intro img")).toHaveCount(0);
  const title = await page.locator(".hero h1").boundingBox(),
    photo = await page.locator(".hero-heading .photo-compact").boundingBox();
  if (info.project.name === "desktop")
    expect(photo!.x).toBeGreaterThanOrEqual(title!.x + title!.width);
  else expect(photo!.y).toBeGreaterThanOrEqual(title!.y + title!.height);
  const asteriskSize = await page
    .locator(".hero-asterisk")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(asteriskSize).toBeGreaterThanOrEqual(32);
  expect(asteriskSize).toBeLessThanOrEqual(44);
  const bullet = await page.locator(".hero-asterisk").boundingBox(),
    introduction = await page.locator(".hero-intro > p").boundingBox();
  expect(introduction!.x - bullet!.x - bullet!.width).toBeLessThanOrEqual(26);
  for (const theme of ["dark", "light"] as const) {
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light theme" }).click();
    await page.locator(".hero").screenshot({
      path: `artifacts/milestone-2.3/${info.project.name}-hero-${theme}.png`,
    });
    await page.locator(".personal").screenshot({
      path: `artifacts/milestone-2.3/${info.project.name}-personal-${theme}.png`,
    });
  }
  for (const [name, destination] of [
    ["Words beyond code.", "/writing"],
    ["The person behind the projects.", "/about"],
  ]) {
    await page.goto("/");
    const link = page
      .locator(".personal-redirects")
      .getByRole("link", { name: new RegExp(name) });
    await expect(link).toHaveAttribute("href", destination);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
  }
});
