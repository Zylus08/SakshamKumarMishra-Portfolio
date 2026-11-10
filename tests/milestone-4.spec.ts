import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { documents } from "../src/lib/assets";
import manifest from "./fixtures/document-integrity.json";

test("four authentic documents download unchanged and academic CV is accessible from Research", async ({
  page,
  request,
}) => {
  await page.goto("/about");
  await expect(page.locator("main .document-item")).toHaveCount(4);
  for (const doc of documents) {
    const record = manifest.find((item) => item.path === doc.file)!;
    const response = await request.get(doc.file!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect(
      createHash("sha256")
        .update(await response.body())
        .digest("hex"),
    ).toBe(record.sha256);
    const downloadPromise = page.waitForEvent("download");
    await page
      .locator("main")
      .getByRole("link", { name: `Download ${doc.title} (PDF)`, exact: true })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(doc.downloadName);
    expect(
      createHash("sha256")
        .update(await fs.readFile((await download.path())!))
        .digest("hex"),
    ).toBe(record.sha256);
  }
  await page.goto("/research");
  const cv = documents.find((doc) => doc.id === "academic")!;
  await expect(
    page.locator("main").getByRole("link", {
      name: "Download Academic / Research CV (PDF)",
      exact: true,
    }),
  ).toHaveAttribute("href", cv.file!);
  await page.locator(".resume-menu summary").click();
  await expect(
    page
      .locator(".resume-popover")
      .getByRole("link", { name: /Download Academic/ }),
  ).toBeVisible();
});

test("unconfigured and failed live UI states never claim delivery", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() === "GET")
      await route.fulfill({ json: { mode: "disabled" } });
    else await route.fulfill({ status: 503, json: { code: "unconfigured" } });
  });
  await page.goto("/contact");
  await expect(
    page.getByText(
      "Email sending is not configured yet. You can still review the form.",
    ),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Email (required)", exact: true })
    .fill("m4-fixture@example.test");
  await page
    .getByRole("textbox", { name: "Subject (required)", exact: true })
    .fill("Test only inquiry");
  await page
    .getByRole("textbox", { name: "Message (required)", exact: true })
    .fill("This is an intercepted test, never an actual email.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".form-status")).toHaveAttribute(
    "data-state",
    "failed",
  );
  await expect(page.locator(".form-status")).not.toContainText("Accepted by");
  await page.route("**/api/contact", (route) => route.abort("failed"));
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText(
    "could not confirm acceptance",
  );
});
