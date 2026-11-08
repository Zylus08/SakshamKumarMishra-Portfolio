import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DocumentSelector } from "../src/components/document-selector";
import { documents } from "../src/lib/assets";
async function fillForm(
  page: import("@playwright/test").Page,
  email = "browser-fixture@example.test",
) {
  await page
    .getByRole("textbox", { name: "Email (required)", exact: true })
    .fill(email);
  await page
    .getByRole("textbox", { name: "Subject (required)", exact: true })
    .fill("Browser test inquiry");
  await page
    .getByRole("textbox", { name: "Message (required)", exact: true })
    .fill("This is a mock test message. Do not send an email.");
}
test("resume disclosure empty state, escape, outside dismissal and five tabs", async ({
  page,
}, info) => {
  await page.goto("/");
  const summary = page.locator(".resume-menu summary");
  await summary.click();
  await expect(page.locator(".resume-popover")).toBeVisible();
  await expect(page.locator(".resume-popover")).toContainText(
    "once the documents are added",
  );
  await expect(page.locator(".resume-popover a")).toHaveCount(0);
  await summary.press("Escape");
  await expect(page.locator(".resume-popover")).not.toBeVisible();
  await summary.click();
  await page.locator("h1").click();
  await expect(page.locator(".resume-popover")).not.toBeVisible();
  if (info.project.name === "desktop")
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link"),
    ).toHaveCount(5);
  await page.goto("/about");
  await expect(page.locator("main .document-empty")).toBeVisible();
});
test("photo fallbacks, icon metadata and compact/tablet layouts", async ({
  page,
  request,
}) => {
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of ["/", "/about", "/contact"]) {
      await page.goto(url);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${url} at ${width}`,
      ).toBe(true);
      await expect(page.locator(".personal-photo img")).toHaveCount(0);
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      ).toBe(true);
    }
  }
  await expect(page.locator('link[rel=icon][href*="icon.svg"]')).toHaveCount(1);
  for (const path of [
    "/icon.svg",
    "/favicon.ico",
    "/favicon-16.png",
    "/favicon-32.png",
    "/apple-icon.png",
  ])
    expect((await request.get(path)).status()).toBe(200);
});
test("contact validation and real route mock flow are accessible", async ({
  page,
}, info) => {
  await page.goto("/contact");
  await expect(
    page.getByText("Test mode — real email delivery is not configured."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Test contact form" }).click();
  await expect(
    page.getByRole("textbox", { name: "Email (required)", exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await fillForm(page, `browser-${info.project.name}@example.test`);
  await page.getByRole("button", { name: "Test contact form" }).click();
  await expect(page.locator(".form-status")).toHaveAttribute(
    "data-state",
    "mock",
  );
  await expect(page.getByRole("status")).toContainText("No email was sent");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
});
test("contact UI handles provider acknowledgement, failure and rate limit without false delivery", async ({
  page,
}) => {
  await page.goto("/contact");
  for (const [status, body, expected] of [
    [202, { code: "accepted" }, "accepted"],
    [502, { code: "failed" }, "failed"],
    [429, { code: "rate_limited", retryAfter: 120 }, "rate_limited"],
    [503, { code: "unconfigured" }, "failed"],
  ] as const) {
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() === "POST")
        await route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      else await route.continue();
    });
    await fillForm(page);
    await page.getByRole("button", { name: "Test contact form" }).click();
    await expect(page.locator(".form-status")).toHaveAttribute(
      "data-state",
      expected,
    );
    if (status === 202)
      await expect(page.getByRole("status")).toContainText(
        "Inbox delivery is not yet confirmed",
      );
    await page.unroute("**/api/contact");
  }
});
test("contact is discoverable in footer and palette without a sixth primary tab", async ({
  page,
}) => {
  await page.goto("/about");
  await page
    .locator("footer")
    .getByRole("link", { name: "Start a conversation" })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("Contact");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".social-links")).toHaveCount(2);
  for (const group of await page.locator(".social-links").all())
    await expect(group.locator("a")).toHaveCount(4);
});

test("configured document fixture downloads with meaningful name and opens preview", async ({
  page,
  context,
}) => {
  const file = "/documents/unit-test-only.pdf";
  await context.route("**" + file, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/pdf",
      body: "%PDF-1.7\n% isolated transport fixture, never a public resume",
    }),
  );
  await page.goto("/about");
  await page.setContent(
    "<main>" +
      renderToStaticMarkup(
        createElement(DocumentSelector, {
          documents: [{ ...documents[0], file }],
        }),
      ) +
      "</main>",
  );
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", {
      name: "Download Software Engineering Resume (PDF)",
      exact: true,
    })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(documents[0].downloadName);
  const previewPromise = context.waitForEvent("page");
  await page
    .getByRole("link", {
      name: "Preview Software Engineering Resume (PDF, opens in a new tab)",
      exact: true,
    })
    .click();
  const preview = await previewPromise;
  await expect(preview).toHaveURL(new RegExp("/documents/unit-test-only.pdf"));
  await preview.close();
});
