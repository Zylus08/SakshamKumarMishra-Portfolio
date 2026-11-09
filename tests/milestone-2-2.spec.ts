import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import { documents, photographs, writingCovers } from "../src/lib/assets";
declare global {
  interface Window {
    layoutShiftScore: number;
  }
}

test("authentic photos, category covers and stable responsive frames", async ({
  page,
}, info) => {
  const measurements: { route: string; width: number; shift: number }[] = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    (window as Window & { layoutShiftScore: number }).layoutShiftScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          hadRecentInput: boolean;
          value: number;
        };
        if (!shift.hadRecentInput)
          (window as Window & { layoutShiftScore: number }).layoutShiftScore +=
            shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, photo] of [
      ["/", photographs.portrait],
      ["/about", photographs.about],
    ] as const) {
      await page.goto(route);
      const img = page.locator("main .personal-photo img");
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute(
        "src",
        new RegExp(encodeURIComponent(photo!.src)),
      );
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await expect(img).toHaveAttribute("width", String(photo!.width));
      await expect(img).toHaveAttribute("height", String(photo!.height));
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const shift = await page.evaluate(() => window.layoutShiftScore);
      measurements.push({ route, width, shift });
      expect(shift, `${route} at ${width}px`).toBeLessThan(0.1);
      await img.screenshot({
        path: `artifacts/photography/${info.project.name}-${width}-${route === "/" ? "home" : "about"}.png`,
      });
      if (route === "/")
        await expect(
          page.locator(".photo-lifestyle .photo-fallback"),
        ).toHaveCount(1);
    }
    await page.goto("/writing");
    await expect(page.locator(".category-cover")).toHaveCount(4);
    for (const cover of writingCovers) {
      const button = page.getByRole("button", {
        name: `Browse ${cover.category}`,
        exact: true,
      });
      await button.scrollIntoViewIfNeeded();
      const img = button.locator("img");
      await expect(img).toHaveAttribute(
        "src",
        new RegExp(encodeURIComponent(cover.photo!.src)),
      );
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("button", { name: cover.category, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(".entry")).toHaveCount(0);
      await expect(page.getByText("No entries here. Yet.")).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const shift = await page.evaluate(() => window.layoutShiftScore);
    measurements.push({ route: "/writing", width, shift });
    expect(shift, `writing at ${width}px`).toBeLessThan(0.1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/photography/${info.project.name}-${width}-writing.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await fs.writeFile(
    `artifacts/photography/${info.project.name}-layout-shifts.json`,
    JSON.stringify(measurements, null, 2),
  );
});

test("three authentic PDFs respond and academic CV has no fabricated link", async ({
  page,
  request,
}) => {
  await page.goto("/about");
  for (const doc of documents) {
    const link = page
      .locator("main")
      .getByRole("link", { name: `Download ${doc.title} (PDF)`, exact: true });
    if (!doc.file) {
      await expect(link).toHaveCount(0);
      continue;
    }
    await expect(link).toHaveAttribute("href", doc.file);
    await expect(link).toHaveAttribute("download", doc.downloadName);
    const response = await request.get(doc.file);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
});
