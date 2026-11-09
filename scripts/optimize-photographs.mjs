import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

// Originals stay local and unchanged; only the derivatives are served publicly.
const root = process.cwd();
const source = path.resolve(root, "assets/source-photos");
const output = path.resolve(root, "public/images");
const files = {
  "headshot.jpeg": "formal-headshot",
  "sunlit outdoor.jpeg": "outdoor-black-sweater",
  "orange_navyblue jacket.jpeg": "poetry-portrait",
  "arms rested.jpeg": "reflections-portrait",
  "green t shirt.jpeg": "engineering-portrait",
};
await fs.mkdir(source, { recursive: true });
const manifest = [];
for (const [name, slug] of Object.entries(files)) {
  const original = path.join(source, name);
  const input = await fs
    .readFile(original)
    .catch(() => fs.readFile(path.join(output, name)));
  const result = await sharp(input)
    .rotate()
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(output, `${slug}.webp`));
  manifest.push({
    source: name,
    output: `/images/${slug}.webp`,
    width: result.width,
    height: result.height,
    sourceBytes: input.length,
    bytes: result.size,
    sha256: crypto.createHash("sha256").update(input).digest("hex"),
  });
}
// Preserve every user original, including the two unused photographs.
for (const name of [
  ...Object.keys(files),
  "suited up.jpeg",
  "casual researcher.jpeg",
]) {
  const from = path.resolve(output, name),
    to = path.resolve(source, name);
  if (!from.startsWith(output + path.sep) || !to.startsWith(source + path.sep))
    throw new Error("Unsafe source path");
  try {
    await fs.access(to);
  } catch {
    await fs.rename(from, to);
  }
}
await fs.writeFile(
  "docs/photograph-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(JSON.stringify(manifest, null, 2));
