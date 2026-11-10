import test from "node:test";
import assert from "node:assert/strict";
import {
  articleHeadings,
  rehypeArticleHeadings,
} from "../../src/lib/article-headings";

test("article anchors ignore fenced examples and distinguish repeated headings", () => {
  assert.deepEqual(
    articleHeadings(
      "## Method\n```md\n## Not a section\n```\n### **Evidence**\n## Method",
    ),
    [
      { id: "method", title: "Method", level: 2 },
      { id: "evidence", title: "Evidence", level: 3 },
      { id: "method-2", title: "Method", level: 2 },
    ],
  );
});

test("rendered headings use visible text and the same duplicate anchors", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "h2",
        properties: {} as Record<string, unknown>,
        children: [
          {
            type: "element",
            tagName: "strong",
            children: [{ type: "text", value: "Method" }],
          },
        ],
      },
      {
        type: "element",
        tagName: "h3",
        properties: {} as Record<string, unknown>,
        children: [{ type: "text", value: "Method" }],
      },
    ],
  };
  rehypeArticleHeadings()(tree);
  assert.deepEqual(
    tree.children.map((n) => n.properties.id),
    ["method", "method-2"],
  );
});
