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

// Regression fixture: verify that unclosed <br> tag is strictly rejected by MDX compiler
let caughtUnclosedBr = false;
try {
  await serialize("Table cell<br>new line");
} catch (err) {
  assert.ok(err.message.includes("Expected a closing tag for `<br>`"));
  caughtUnclosedBr = true;
}
assert.ok(
  caughtUnclosedBr,
  "Regression fixture failed: unclosed <br> was not rejected by serialize()",
);

// Regression fixture: verify that valid self-closing <br /> compiles cleanly in table context
const tableFixture = await serialize(
  "| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | First line<br />Second line |",
);
assert.ok(tableFixture.compiledSource.includes("Second line"));
console.log(
  "Regression fixture: unclosed <br> rejection and valid <br /> table compilation verified.",
);
