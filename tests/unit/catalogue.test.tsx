import test from "node:test";
import assert from "node:assert/strict";
import { allEntries, getEntries, schema } from "../../src/lib/content";
import {
  projectCategories,
  homepageProjectLimit,
} from "../../src/lib/project-categories";

test("audited catalogue includes every required quant case and seven featured projects", () => {
  const projects = getEntries("projects");
  assert.equal(projects.length, 24);
  assert.equal(
    projects.filter((entry) => entry.featured).length,
    homepageProjectLimit,
  );
  assert.equal(homepageProjectLimit, 7);
  assert.deepEqual(
    [...new Set(projects.map((entry) => entry.category))].sort(),
    [...projectCategories].sort(),
  );
  const quant = projects.filter(
    (entry) => entry.category === "Quantitative Finance",
  );
  assert.deepEqual(
    quant.map((entry) => entry.slug).sort(),
    [
      "tradecore",
      "regime-shift",
      "risklab",
      "deephedge-rl",
      "satoshi-flow",
      "flowstate",
      "aqc",
    ].sort(),
  );
  for (const entry of projects) {
    assert.ok(entry.evidence, entry.slug);
    assert.equal(entry.status, "Independent exploration");
    assert.ok(
      entry.body.includes(`/blob/${entry.evidence.commit}/`),
      entry.slug,
    );
    assert.ok(entry.body.includes("## Limitations"), entry.slug);
    assert.ok(entry.body.includes("## Results"), entry.slug);
  }
});

test("all case-study and research cross-links resolve and missing research stays pending", () => {
  const entries = allEntries();
  const routes = new Set(
    entries.map((entry) => `/${entry.kind}/${entry.slug}`),
  );
  assert.equal(routes.size, entries.length);
  for (const entry of entries) {
    for (const match of entry.body.matchAll(
      /\]\((\/(?:projects|research)\/[^)]+)\)/g,
    )) {
      assert.ok(routes.has(match[1]), `${entry.slug}: ${match[1]}`);
    }
  }
  for (const slug of ["h-star", "mobilelora"]) {
    const entry = entries.find((item) => item.slug === slug)!;
    assert.equal(entry.status, "Verification pending");
    assert.equal(entry.featured, false);
    assert.equal(entry.code, undefined);
    assert.equal(entry.paper, undefined);
  }
  assert.equal(
    entries.filter((entry) => entry.slug.includes("big-five")).length,
    1,
  );
});

test("external metadata rejects credentials and non-HTTPS URLs", () => {
  const valid = {
    title: "Example",
    summary: "Example",
    category: "Example",
    status: "Independent exploration",
  };
  for (const code of [
    "javascript:alert(1)",
    "http://github.com/example/repo",
    "https://user:secret@github.com/example/repo",
    "not a URL",
  ]) {
    assert.equal(schema.safeParse({ ...valid, code }).success, false);
  }
  assert.equal(
    schema.safeParse({ ...valid, code: "https://github.com/Zylus08/TradeCore" })
      .success,
    true,
  );
});
