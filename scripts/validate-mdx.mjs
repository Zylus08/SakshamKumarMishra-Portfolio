import assert from "node:assert/strict";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
// Verify authoring support without publishing a fictitious article.
const { compiledSource } = await serialize(
  "## Authoring fixture\n\nInline math: $y = x^2$.\n\n```ts\nconst value = 1;\n```\n\n<Note>Editorial note</Note>",
  { mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } },
);
assert.ok(compiledSource.includes("katex"));
assert.ok(compiledSource.includes("language-ts"));
assert.ok(compiledSource.includes("Editorial note"));
console.log(
  "Writing MDX fixture: math, code, and custom component compilation passed.",
);
let count = 0;
for (const kind of ["projects", "research", "writing"]) {
  const directory = path.join("src/content", kind);
  for (const file of fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".mdx"))) {
    const { content } = matter(
      fs.readFileSync(path.join(directory, file), "utf8"),
    );
    await serialize(content, {
      mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
    });
    count++;
  }
}
console.log(`Compiled all ${count} catalogue MDX documents.`);
const diagramFixture = await serialize(
  '<Diagram steps="Analyze|Plan|Validate" /><Note>{globalThis.untrustedExpression}</Note>',
);
assert.ok(diagramFixture.compiledSource.includes("Analyze|Plan|Validate"));
assert.ok(!diagramFixture.compiledSource.includes("untrustedExpression"));
console.log(
  "Literal diagram labels survive compilation; JavaScript expressions remain blocked.",
);
