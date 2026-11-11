import test from "node:test";
import assert from "node:assert/strict";
import {
  homepageProjects,
  resolvedPathways,
} from "../../src/lib/career-content";
import { getEntries } from "../../src/lib/content";

test("homepage ranking preserves exactly the seven featured articles", () => {
  const selected = homepageProjects();
  assert.deepEqual(
    selected.map((entry) => entry.slug),
    [
      "tradecore",
      "flowstate",
      "roadvision",
      "hydra-stream",
      "risklab",
      "project-janus",
      "thermodynamic-evolution",
    ],
  );
  assert.deepEqual(
    selected.map((e) => e.slug).sort(),
    getEntries("projects")
      .filter((e) => e.featured)
      .map((e) => e.slug)
      .sort(),
  );
  assert.ok(selected.every((e) => e.preview && e.evidence));
  assert.throws(() =>
    homepageProjects(
      getEntries("projects").filter((e) => e.slug !== "tradecore"),
    ),
  );
  assert.throws(() =>
    homepageProjects(
      getEntries("projects").map((e) =>
        e.slug === "tradecore" ? { ...e, slug: "unknown" } : e,
      ),
    ),
  );
});

test("four career lenses resolve three evidenced articles and the matching authentic document", () => {
  const pathways = resolvedPathways();
  assert.deepEqual(
    pathways.map((p) => p.document?.id),
    ["quantitative", "academic", "machine-learning", "software"],
  );
  for (const pathway of pathways) {
    assert.equal(pathway.entries.length, 3);
    assert.equal(new Set(pathway.entries.map((e) => e.href)).size, 3);
    assert.ok(pathway.entries.every((e) => e.title && e.rationale));
    assert.ok(pathway.document?.file?.endsWith(".pdf"));
    assert.ok(!pathway.entries.some((e) => /h-star|mobilelora/.test(e.href)));
    const url = new URL(pathway.moreHref, "https://example.test");
    if (url.searchParams.has("category"))
      assert.ok(
        getEntries("projects").some(
          (e) => e.category === url.searchParams.get("category"),
        ),
      );
  }
  assert.equal(getEntries("projects").length, 24);
});
