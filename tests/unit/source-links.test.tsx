import test from "node:test";
import assert from "node:assert/strict";
import { allEntries } from "../../src/lib/content";
import manifest from "../fixtures/public-source-links.json";

test("all public article source paths exist in the independently fetched pinned trees", () => {
  const known = new Map(manifest.links.map((item) => [item.url, item.blob]));
  let count = 0;
  for (const entry of allEntries()) {
    for (const match of entry.body.matchAll(
      /https:\/\/github\.com\/[^\s)"<>]+\/blob\/[^\s)"<>]+/g,
    )) {
      const url = new URL(match[0]);
      const [, owner, repo, , commit] = url.pathname.split("/");
      assert.equal(`${owner}/${repo}`, entry.evidence?.repository);
      assert.equal(commit, entry.evidence?.commit);
      assert.match(known.get(url.href) || "", /^[a-f0-9]{40}$/, url.href);
      count++;
    }
  }
  assert.ok(count >= 90);
});
