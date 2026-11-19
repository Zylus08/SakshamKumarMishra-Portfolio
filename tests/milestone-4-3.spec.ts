import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("First Principles collection contains deep dive essay links for all 4 projects", async ({
  page,
}) => {
  await page.goto("/");
  const collection = page.locator("#first-principles");
  await expect(collection).toBeVisible();

  // Deep dive essay links
  const essayLinks = collection.locator(".fp-essay-link");
  await expect(essayLinks).toHaveCount(4);

  await expect(
    collection.locator("a[href='/writing/sql-query-outgrows-memory']"),
  ).toBeVisible();
  await expect(
    collection.locator("a[href='/writing/building-a-cpp-interpreter']"),
  ).toBeVisible();
  await expect(
    collection.locator("a[href='/research/faster-kernels-slower-training']"),
  ).toBeVisible();
  await expect(
    collection.locator("a[href='/research/cpu-language-model-inference']"),
  ).toBeVisible();

  const scan = await new AxeBuilder({ page })
    .include("#first-principles")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("Article 1 (AXIOM Engineering Essay) renders with Grace Hash Join, equations, and cross-links", async ({
  page,
}) => {
  await page.goto("/writing/sql-query-outgrows-memory");
  await expect(page.locator(".page-heading h1")).toContainText(
    "What Happens When a SQL Query Outgrows Memory?",
  );
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Engineering",
  );

  // Content assertions
  await expect(page.locator("body")).toContainText("Grace Hash Join");
  await expect(page.locator("body")).toContainText("5.37 GB");
  await expect(page.locator("body")).toContainText("DuckDB");
  await expect(page.locator("body")).toContainText("AXMB v1");

  // Math and diagram elements
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.locator(".diagram").first()).toBeVisible();

  // Reciprocal link to case study
  const caseStudyLink = page.locator("a[href='/projects/axiom']");
  await expect(caseStudyLink.first()).toBeVisible();

  // Accessibility audit
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("Article 2 (PRAXIS Engineering Essay) renders with memory model, RAII, and cross-links", async ({
  page,
}) => {
  await page.goto("/writing/building-a-cpp-interpreter");
  await expect(page.locator(".page-heading h1")).toContainText(
    "Building a C++ Interpreter Changed How I Think About Memory",
  );
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Engineering",
  );

  // Content assertions
  await expect(page.locator("body")).toContainText(
    "Abstract Validated Handle Reference Model",
  );
  await expect(page.locator("body")).toContainText("RAII");
  await expect(page.locator("body")).toContainText("258");
  await expect(page.locator(".diagram").first()).toBeVisible();

  // Reciprocal link to case study
  const caseStudyLink = page.locator("a[href='/projects/praxis']");
  await expect(caseStudyLink.first()).toBeVisible();

  // Accessibility audit
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("Article 3 (FORGE Research Note) renders negative result, Amdahl analysis, and cross-links", async ({
  page,
}) => {
  await page.goto("/research/faster-kernels-slower-training");
  await expect(page.locator(".page-heading h1")).toContainText(
    "Why My Faster Kernels Made PyTorch Training Slower",
  );
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Efficient ML",
  );

  // Status badge
  await expect(page.locator("body")).toContainText("Independent exploration");

  // Content assertions
  await expect(page.locator("body")).toContainText("0.8504×");
  await expect(page.locator("body")).toContainText("Amdahl");
  await expect(page.locator("body")).toContainText("82.48%");
  await expect(page.locator("body")).toContainText("1.0965×");
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.locator(".diagram").first()).toBeVisible();

  // Required sections
  await expect(page.locator(".prose h2#results")).toBeVisible();
  await expect(page.locator(".prose h2#limitations")).toBeVisible();
  await expect(page.locator(".prose h2#reproducibility")).toBeVisible();

  // Reciprocal link to case study
  const caseStudyLink = page.locator("a[href='/projects/forge']");
  await expect(caseStudyLink.first()).toBeVisible();

  // Accessibility audit
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("Article 4 (VECTRA Research Note) renders CPU inference dynamics, roofline analysis, and cross-links", async ({
  page,
}) => {
  await page.goto("/research/cpu-language-model-inference");
  await expect(page.locator(".page-heading h1")).toContainText(
    "Where Does the Time Go in CPU Language-Model Inference?",
  );
  await expect(page.locator(".page-heading .eyebrow")).toContainText(
    "Efficient ML",
  );

  // Status badge
  await expect(page.locator("body")).toContainText("Independent exploration");

  // Content assertions
  await expect(page.locator("body")).toContainText("16.82 tok/s");
  await expect(page.locator("body")).toContainText("1,061.4 MB");
  await expect(page.locator("body")).toContainText("Q4_K");
  await expect(page.locator("body")).toContainText("Q6_K");
  await expect(page.locator("body")).toContainText("AVX2");
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.locator(".diagram").first()).toBeVisible();

  // Required sections
  await expect(page.locator(".prose h2#results")).toBeVisible();
  await expect(page.locator(".prose h2#limitations")).toBeVisible();
  await expect(page.locator(".prose h2#reproducibility")).toBeVisible();

  // Reciprocal link to case study
  const caseStudyLink = page.locator("a[href='/projects/vectra']");
  await expect(caseStudyLink.first()).toBeVisible();

  // Accessibility audit
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("Project case studies cross-link back to their respective technical essays", async ({
  page,
}) => {
  // AXIOM case study -> Essay link
  await page.goto("/projects/axiom");
  await expect(
    page.locator("a[href='/writing/sql-query-outgrows-memory']").first(),
  ).toBeVisible();

  // PRAXIS case study -> Essay link
  await page.goto("/projects/praxis");
  await expect(
    page.locator("a[href='/writing/building-a-cpp-interpreter']").first(),
  ).toBeVisible();

  // FORGE case study -> Research Note link
  await page.goto("/projects/forge");
  await expect(
    page.locator("a[href='/research/faster-kernels-slower-training']").first(),
  ).toBeVisible();

  // VECTRA case study -> Research Note link
  await page.goto("/projects/vectra");
  await expect(
    page.locator("a[href='/research/cpu-language-model-inference']").first(),
  ).toBeVisible();
});

test("Writing directory renders Engineering category filter and essays", async ({
  page,
}) => {
  await page.goto("/writing");
  await expect(page.locator(".page-heading .eyebrow")).toContainText("WRITING");
  await expect(page.locator(".page-heading h1")).toContainText("Notes from the margins.");

  // Click Engineering category tab
  const engineeringTab = page.locator("button, a", { hasText: "Engineering" }).first();
  await expect(engineeringTab).toBeVisible();
  await engineeringTab.click();

  // Verify essays are displayed
  await expect(
    page.locator("a[href='/writing/sql-query-outgrows-memory']").first(),
  ).toBeVisible();
  await expect(
    page.locator("a[href='/writing/building-a-cpp-interpreter']").first(),
  ).toBeVisible();
});
