import assert from "node:assert/strict";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
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
