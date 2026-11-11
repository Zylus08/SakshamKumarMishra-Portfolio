import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { journeyMilestones } from "../src/lib/journey";

test("eleven journey milestones expose chronological dates, overlaps, roles and real links", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const journey = page.getByRole("region", { name: "The Journey." });
  await expect(journey).toBeVisible();
  const events = journey.locator(".journey-event");
  await expect(events).toHaveCount(11);
  expect(
    await events.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-milestone")),
    ),
  ).toEqual(journeyMilestones.map((e) => e.id));
  for (const milestone of journeyMilestones) {
    const row = journey.locator(`[data-milestone="${milestone.id}"]`);
    await expect(
      row.getByRole("heading", { name: milestone.title, exact: true }),
    ).toBeVisible();
    await expect(row.locator("time").first()).toHaveAttribute(
      "datetime",
      milestone.start,
    );
    if (milestone.end === "present")
      await expect(row.locator(".journey-date")).toContainText("present");
    else if (milestone.end)
      await expect(row.locator("time").last()).toHaveAttribute(
        "datetime",
        milestone.end,
      );
    if (milestone.link) {
      await expect(row.getByRole("link")).toHaveAttribute(
        "href",
        milestone.link.href,
      );
      expect((await request.get(milestone.link.href)).status()).toBe(200);
    }
  }
  await expect(journey).toContainText(
    "Dr. Devnaad Singh, School of Business, UPES",
  );
  await expect(journey).toContainText(
    "Center of Excellence in Data Science & Artificial Intelligence, TIET",
  );
  await expect(journey).toContainText("not direct employment with ISRO");
  await expect(page.locator("main section")).toHaveCount(6);
  expect(
    await page
      .locator("main section")
      .evaluateAll((els) => els.map((el) => el.classList[1])),
  ).toEqual([
    "section",
    "research-section",
    "engineering",
    "journey",
    "personal",
    "invitation",
  ]);
  await expect(page.locator(".career-tabs [role=tab]")).toHaveCount(4);
  await expect(page.locator(".project-panel")).toHaveCount(7);
  await expect(page.locator(".research-row")).toHaveCount(3);
  await expect(page.locator(".desktop-nav > a")).toHaveCount(5);
});

test("journey is keyboard navigable with stable reduced-motion geometry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const journey = page.locator("#journey");
  const before = await journey.boundingBox();
  const first = journey.getByRole("link").first();
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(journey.getByRole("link").nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/sama-contribution$/);
  await page.goBack();
  await journey.locator(".journey-event").last().scrollIntoViewIfNeeded();
  const after = await journey.boundingBox();
  expect(Math.abs(before!.height - after!.height)).toBeLessThan(1);
  expect(Math.abs(before!.width - after!.width)).toBeLessThan(1);
  for (const row of await journey.locator(".journey-event").all())
    await expect(row).toHaveCSS("transform", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

test("journey years remain readable and accessible at mobile and desktop sizes", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const widths = info.project.name === "mobile" ? [320, 390] : [768, 1440];
  for (const width of widths)
    for (const theme of ["dark", "light"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("skm-theme", value),
        theme,
      );
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const journey = page.locator("#journey");
      await journey.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const scan = await new AxeBuilder({ page })
        .include("#journey")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(scan.violations).toEqual([]);
      for (const row of await journey.locator(".journey-event").all()) {
        const box = await row.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
      if (width === 320 || width === 1440) {
        await page.setViewportSize({ width, height: 2600 });
        for (const year of ["2024", "2025", "2026"]) {
          const group = journey
            .locator(".journey-year")
            .filter({
              has: page.getByRole("heading", { name: year, exact: true }),
            });
          await group.evaluate((el) =>
            window.scrollTo({
              top: window.scrollY + el.getBoundingClientRect().top - 120,
              behavior: "instant",
            }),
          );
          await group.screenshot({
            path: `docs/assets/journey/${year}-${width}-${theme}.png`,
          });
        }
      }
    }
});
