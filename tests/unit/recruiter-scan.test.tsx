import test from "node:test";
import assert from "node:assert/strict";
import { allEntries } from "../../src/lib/content";
import {
  homepageEvidence,
  proofFor,
  researchPreviews,
} from "../../src/lib/homepage-evidence";
import {
  careerPathways,
  projectPreviews,
  homepageProjectOrder,
} from "../../src/lib/career-pathways";
import { experienceHighlights } from "../../src/lib/experience";
import {
  canonicalOrigin,
  pageMetadata,
  siteTitle,
} from "../../src/lib/site-metadata";
import manifest from "../fixtures/public-source-links.json";

test("all ten featured proof points resolve to independently recorded pinned source paths", () => {
  const entries = allEntries().filter(
    (e) => e.featured && e.kind !== "writing",
  );
  const sources = new Set(manifest.links.map((item) => item.url));
  assert.equal(entries.length, 10);
  for (const entry of entries) {
    const proof = proofFor(entry);
    assert.ok(
      proof.sources.every((url) => sources.has(url)),
      entry.slug,
    );
    assert.ok(entry.body.includes("## Limitations"), entry.slug);
    assert.equal(entry.status, "Independent exploration");
    if (entry.kind === "research") assert.ok(researchPreviews[entry.slug]);
  }
  assert.deepEqual(
    Object.entries(homepageEvidence)
      .filter(([, p]) => p.count)
      .map(([key, p]) => [key, p.count]),
    [
      ["projects/risklab", 13],
      ["projects/hydra-stream", 5],
      ["projects/thermodynamic-evolution", 4],
      ["research/eeg-representation", 3],
    ],
  );
  assert.equal(homepageEvidence["projects/risklab"].auditDate, "2026-11-09");
  assert.equal(
    homepageEvidence["projects/risklab"].classification,
    "Offline tests reproduced",
  );
  assert.ok(
    Object.entries(homepageEvidence)
      .filter(([key]) => key !== "projects/risklab")
      .every(([, p]) => p.classification === "Source-reviewed"),
  );
  assert.throws(() =>
    proofFor({ ...entries[0], body: "No pinned source here" }),
  );
});

test("shortlist descriptors are distinct navigation copy and the Quant trio leads", () => {
  assert.deepEqual(homepageProjectOrder.slice(0, 3), [
    "tradecore",
    "flowstate",
    "risklab",
  ]);
  for (const p of careerPathways)
    for (const [index, text] of p.rationales.entries()) {
      assert.ok(text.split(/\s+/).length <= 15, text);
      assert.notEqual(text, projectPreviews[p.slugs[index]]);
      assert.notEqual(text, researchPreviews[p.slugs[index]]);
    }
  assert.equal(new Set(careerPathways.flatMap((p) => p.rationales)).size, 12);
});

test("experience types, expected graduation and canonical identity stay explicit", () => {
  assert.equal(experienceHighlights.length, 4);
  assert.deepEqual(
    experienceHighlights.map((e) => e.dates),
    ["May–Aug 2025", "Jan–Jun 2026", "Aug 2026–present", "Since Aug 2024"],
  );
  assert.equal(experienceHighlights[3].role, "B.E. · expected June 2028");
  assert.ok(experienceHighlights.every((e) => e.href === "#journey"));
  assert.doesNotMatch(
    JSON.stringify(experienceHighlights),
    /ISRO|IIT Ropar|Professor|accepted|patent/,
  );
  assert.equal(canonicalOrigin, "https://www.sakshamkumarmishra.cv");
  assert.match(siteTitle, /Saksham Kumar Mishra/);
  const metadata = pageMetadata(
    "Kamish",
    "Collaborative streaming",
    "/projects/hydra-stream",
  );
  assert.equal(metadata.alternates?.canonical, "/projects/hydra-stream");
  assert.equal(
    metadata.openGraph?.url,
    canonicalOrigin + "/projects/hydra-stream",
  );
});
