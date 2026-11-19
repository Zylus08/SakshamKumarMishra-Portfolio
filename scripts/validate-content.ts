import assert from "node:assert/strict";
import { allEntries, schema } from "../src/lib/content";
import { homepageProjects, resolvedPathways } from "../src/lib/career-content";
import { journeyYears } from "../src/lib/journey";
import { proofFor, researchPreviews } from "../src/lib/homepage-evidence";
import { validateAssetConfiguration } from "../src/lib/asset-files";
import { configuredSocials } from "../src/lib/profile";
validateAssetConfiguration();
configuredSocials();
homepageProjects();
resolvedPathways();
journeyYears();
const entries = allEntries();
for (const entry of entries.filter(
  (e) => e.featured && e.kind === "research",
)) {
  assert.ok(researchPreviews[entry.slug]);
  proofFor(entry);
}
assert.ok(entries.length > 0, "Expected at least one content entry");
assert.equal(
  new Set(entries.map((e) => `${e.kind}/${e.slug}`)).size,
  entries.length,
);
for (const entry of entries) {
  assert.match(entry.slug, /^[a-z0-9-]+$/);
  if (entry.kind !== "writing") assert.ok(entry.body.includes("## Results"));
  assert.ok(!entry.paper || entry.status !== "Verification pending");
  const unclosedVoid = entry.body.match(/<(br|hr|img|input)(?![^>]*\/>)[^>]*>/i);
  assert.equal(
    unclosedVoid,
    null,
    `Entry ${entry.kind}/${entry.slug} contains unclosed void tag: "${unclosedVoid?.[0]}". In MDX, void elements must be self-closing (e.g. <br />).`,
  );
}
assert.equal(
  schema.safeParse({ title: "Invalid", status: "Award winning" }).success,
  false,
);
console.log(
  `Validated ${entries.length} MDX entries; duplicate slugs, schema rejection, and content integrity checks passed.`,
);
