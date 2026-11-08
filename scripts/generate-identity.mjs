import fs from "node:fs";
import sharp from "sharp";
export const concepts = [
  {
    name: "01 — Linear initials",
    paths:
      '<path d="M11 10H5v6h6v6H5 M15 10v12m0-6 5-6m-5 6 5 6 M23 22V10l3 6 3-6v12" fill="none" stroke="#f1eee8" stroke-width="2" stroke-linejoin="round"/>',
  },
  {
    name: "02 — Shared-spine atelier",
    paths:
      '<path d="M12 5H5v10h7v12H5 M16 5v22m0-11L26 5m-10 11 10 11 M20 27V15l4 5 4-5v12" fill="none" stroke="#f1eee8" stroke-width="2.5" stroke-linejoin="round"/><path d="M5 5h7" stroke="#cf9874" stroke-width="2.5"/>',
  },
  {
    name: "03 — Framed wordmark",
    paths:
      '<path d="M4 5h24v22H4z" fill="none" stroke="#cf9874" stroke-width="1.5"/><path d="M11 11H6v5h5v5H6 M14 11v10m0-5 4-5m-4 5 4 5 M21 21V11l3 5 3-5v10" fill="none" stroke="#f1eee8" stroke-width="1.6"/>',
  },
];
const svg = (paths, size = 32) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#101114"/>${paths}</svg>`;
for (const [i, concept] of concepts.entries())
  fs.writeFileSync(
    `docs/identity-concepts/concept-${i + 1}.svg`,
    svg(concept.paths),
  );
// The linear initials have the clearest letter separation at favicon scale.
const chosen = svg(
  concepts[0].paths + '<path d="M5 26h6" stroke="#cf9874" stroke-width="2"/>',
);
fs.writeFileSync("src/app/icon.svg", chosen);
for (const size of [16, 32, 64, 180])
  await sharp(Buffer.from(chosen))
    .resize(size, size)
    .png()
    .toFile(
      size === 180 ? "public/apple-icon.png" : `public/favicon-${size}.png`,
    );
const png = fs.readFileSync("public/favicon-32.png"),
  header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
fs.writeFileSync("src/app/favicon.ico", Buffer.concat([header, png]));
let board =
  '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="420"><rect width="900" height="420" fill="#eeeae2"/>';
for (const [i, c] of concepts.entries()) {
  const x = i * 300;
  board += `<text x="${x + 15}" y="30" font-family="sans-serif" font-size="16" fill="#25262b">${c.name}</text>`;
  for (const [j, s] of [16, 32, 64].entries()) {
    for (const [k, bg] of ["#eeeae2", "#191b20"].entries()) {
      const y = 65 + k * 170;
      board += `<rect x="${x + 10 + j * 94}" y="${y}" width="86" height="125" fill="${bg}"/><svg x="${x + 15 + j * 94}" y="${y + 15}" width="${s}" height="${s}" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#101114"/>${c.paths}</svg><text x="${x + 15 + j * 94}" y="${y + 110}" font-family="sans-serif" font-size="12" fill="${k ? "#f1eee8" : "#25262b"}">${s}px</text>`;
    }
  }
}
board += "</svg>";
await sharp(Buffer.from(board)).png().toFile("artifacts/identity-concepts.png");
