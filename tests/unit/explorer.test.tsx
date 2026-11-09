import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Explorer } from "../../src/components/explorer";
import {
  filterEntries,
  type ExplorerItem,
} from "../../src/lib/explorer-filter";

// Isolated fixtures only: no fabricated writing is added to the content tree.
const fixtures: ExplorerItem[] = [
  "Poetry",
  "Personal Reflections",
  "Research Notes",
  "Engineering",
].map((category, i) => ({
  title: `Fixture ${i}`,
  summary: i === 0 ? "Quiet test phrase" : "Systems test phrase",
  category,
  status: "Published",
  slug: `fixture-${i}`,
  tags: ["fixture"],
  featured: false,
}));
test("each writing category filters only its own entries and switching is deterministic", () => {
  for (const fixture of fixtures)
    assert.deepEqual(filterEntries(fixtures, fixture.category, ""), [fixture]);
  assert.equal(filterEntries(fixtures, "Essays", "").length, 0);
  assert.equal(filterEntries(fixtures, "All", "").length, 4);
});
test("search intersects category and existing research status filtering remains valid", () => {
  assert.equal(filterEntries(fixtures, "Poetry", " SYSTEMS ").length, 0);
  assert.equal(filterEntries(fixtures, "Poetry", "quiet").length, 1);
  assert.equal(
    filterEntries(fixtures, "All", "fixture", "Published").length,
    4,
  );
  assert.equal(filterEntries(fixtures, "All", "", "Draft").length, 0);
});
test("writing renders published entries only and retains an honest draft-only empty state", () => {
  const draft = {
    ...fixtures[0],
    title: "PRIVATE_DRAFT_FIXTURE",
    status: "Draft",
  };
  const html = renderToStaticMarkup(
    <Explorer kind="writing" entries={[...fixtures, draft]} />,
  );
  for (const fixture of fixtures) assert.ok(html.includes(fixture.title));
  assert.ok(!html.includes(draft.title));
  assert.ok(
    renderToStaticMarkup(
      <Explorer kind="writing" entries={[draft]} />,
    ).includes("No entries here. Yet."),
  );
});
