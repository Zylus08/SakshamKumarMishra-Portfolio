import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("First Principles collection renders with all 4 projects and pipeline", async ({
  page,
}) => {
  await page.goto("/");
  const collection = page.locator("#first-principles");
  await expect(collection).toBeVisible();

  // Heading and pipeline
  await expect(collection.locator("h3")).toContainText(
    "Four explorations into computational infrastructure",
  );
  const pipeline = collection.locator(".first-principles-pipeline");
  await expect(pipeline).toBeVisible();
  await expect(pipeline).toContainText("SQL Execution");
  await expect(pipeline).toContainText("Language Interpretation");
  await expect(pipeline).toContainText("Neural Training");
  await expect(pipeline).toContainText("Model Inference");

  // 4 cards
  const cards = collection.locator(".first-principles-card");
  await expect(cards).toHaveCount(4);

  const slugs = ["axiom", "praxis", "forge", "vectra"];
  for (const slug of slugs) {
    const card = collection.locator(`a[href='/projects/${slug}']`);
    await expect(card).toBeVisible();
  }

  // Accessibility audit on the collection
  const scan = await new AxeBuilder({ page })
    .include("#first-principles")
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("Project AXIOM case study renders with diagrams, results, and limitations", async ({
  page,
}) => {
  await page.goto("/projects/axiom");
  await expect(page.locator(".page-heading h1")).toContainText("AXIOM");
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Systems & Infrastructure",
  );
  await expect(page.locator(".prose h2#abstract")).toBeVisible();
  await expect(
    page.locator(".prose h2", { hasText: "System Architecture" }),
  ).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Results" })).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Limitations" })).toBeVisible();
  await expect(
    page.locator(".prose h2", { hasText: "Reproducibility" }),
  ).toBeVisible();
  await expect(page.locator(".diagram")).toBeVisible();
  await expect(page.locator("body")).toContainText("5.37 GB");
  await expect(page.locator("body")).toContainText("DuckDB");
  await expect(page.locator("a[href*='Zylus08/Axiom']").first()).toBeVisible();
});

test("Project PRAXIS case study renders with code examples, handles, and RAII", async ({
  page,
}) => {
  await page.goto("/projects/praxis");
  await expect(page.locator(".page-heading h1")).toContainText("PRAXIS");
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Systems & Infrastructure",
  );
  await expect(page.locator(".prose h2#abstract")).toBeVisible();
  await expect(
    page.locator(".prose h2", { hasText: "System Architecture" }),
  ).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Results" })).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Limitations" })).toBeVisible();
  await expect(page.locator(".diagram")).toBeVisible();
  await expect(page.locator("body")).toContainText(
    "Abstract Validated Handle Reference Model",
  );
  await expect(page.locator("body")).toContainText("258");
  await expect(page.locator("a[href*='Zylus08/PRAXIS']").first()).toBeVisible();
});

test("Project FORGE case study renders transparent negative result and Amdahl analysis", async ({
  page,
}) => {
  await page.goto("/projects/forge");
  await expect(page.locator(".page-heading h1")).toContainText("FORGE");
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Machine Learning & AI",
  );
  await expect(page.locator("body")).toContainText("0.8504×");
  await expect(page.locator("body")).toContainText("Amdahl");
  await expect(page.locator("body")).toContainText("NOT ACHIEVED");
  await expect(page.locator(".prose h2#abstract")).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Results" })).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Limitations" })).toBeVisible();
  await expect(page.locator(".diagram")).toBeVisible();
  await expect(page.locator("a[href*='Zylus08/FORGE']").first()).toBeVisible();
});

test("Project VECTRA case study renders with clean-room runtime and GGUF metrics", async ({
  page,
}) => {
  await page.goto("/projects/vectra");
  await expect(page.locator(".page-heading h1")).toContainText("VECTRA");
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Systems & Infrastructure",
  );
  await expect(page.locator("body")).toContainText("16.82 tok/s");
  await expect(page.locator("body")).toContainText(
    "zero runtime dependencies on llama.cpp",
  );
  await expect(page.locator(".prose h2#abstract")).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Results" })).toBeVisible();
  await expect(page.locator(".prose h2", { hasText: "Limitations" })).toBeVisible();
  await expect(page.locator(".diagram")).toBeVisible();
  await expect(page.locator("a[href*='Zylus08/VECTRA']").first()).toBeVisible();
});
