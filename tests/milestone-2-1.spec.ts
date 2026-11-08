import { test, expect } from "@playwright/test";
import { configuredSocials, profile } from "../src/lib/profile";
test("verified profiles render in all supported locations and palette", async ({
  page,
}) => {
  for (const route of ["/", "/about", "/contact"]) {
    await page.goto(route);
    const groups = page.locator(".social-links");
    await expect(groups).toHaveCount(2);
    for (const group of await groups.all()) {
      await expect(group.locator("a")).toHaveCount(4);
      for (const link of configuredSocials()) {
        const anchor = group.getByRole("link", {
          name: `${link.label} profile (opens in a new tab)`,
          exact: true,
        });
        await expect(anchor).toHaveAttribute("href", link.url);
        await expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
        await expect(anchor).toBeVisible();
      }
    }
    await expect(page.getByRole("link", { name: /Codeforces/ })).toHaveCount(0);
  }
  for (const link of configuredSocials()) {
    await page.getByRole("button", { name: "Open command palette" }).click();
    await page.getByRole("combobox").fill(link.label);
    await expect(page.getByRole("option")).toHaveCount(1);
    // Intercept navigation: verify the actual command target without visiting external profiles.
    await page.route(link.url, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<p>External profile navigation test</p>",
      }),
    );
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(link.url);
    await page.goto("/contact");
  }
  await page.getByRole("button", { name: "Open command palette" }).click();
  await page.getByRole("combobox").fill("Codeforces");
  await expect(page.getByRole("option")).toHaveCount(0);
  await page.keyboard.press("Escape");
});
test("visible fallback remains alongside both forms, which stay mock-only", async ({
  page,
  request,
}) => {
  expect((await (await request.get("/api/contact")).json()).mode).toBe("mock");
  for (const route of ["/", "/contact"]) {
    await page.goto(route);
    const form = page.getByRole("form", { name: "Contact Saksham" });
    const email = form.getByRole("link", { name: profile.email, exact: true });
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(
      form.getByText("Test mode — real email delivery is not configured."),
    ).toBeVisible();
  }
});
