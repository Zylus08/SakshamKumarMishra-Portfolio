import assert from "node:assert/strict";
import { allEntries, schema } from "../src/lib/content";
const entries = allEntries();
assert.ok(entries.length > 0, "Expected at least one content entry");
assert.equal(
  new Set(entries.map((e) => `${e.kind}/${e.slug}`)).size,
  entries.length,
);
for (const entry of entries) {
  assert.match(entry.slug, /^[a-z0-9-]+$/);
  if (entry.kind !== "writing") assert.ok(entry.body.includes("## Results"));
  assert.ok(!entry.paper || entry.status !== "Verification pending");
}
assert.equal(
  schema.safeParse({ title: "Invalid", status: "Award winning" }).success,
  false,
);
console.log(
  `Validated ${entries.length} MDX entries; duplicate slugs, schema rejection, and content integrity checks passed.`,
);
