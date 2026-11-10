import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { availableDocuments } from "../../src/lib/asset-files";
import manifest from "../fixtures/document-integrity.json";

test("all four authentic document bytes match the pre-integration snapshot", () => {
  const documents = availableDocuments();
  assert.equal(documents.length, 4);
  for (const item of manifest) {
    const bytes = fs.readFileSync(`public${item.path}`);
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
    assert.ok(documents.some((doc) => doc.file === item.path));
  }
});
