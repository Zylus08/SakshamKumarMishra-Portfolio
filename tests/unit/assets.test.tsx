import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { SocialLinks } from "../../src/components/social-links";
import { DocumentSelector } from "../../src/components/document-selector";
import { Photograph } from "../../src/components/photograph";
import { configuredSocials, profile } from "../../src/lib/profile";
import {
  availableDocuments,
  availablePhotograph,
  validateAssetConfiguration,
} from "../../src/lib/asset-files";
import { documents, photographs, writingCovers } from "../../src/lib/assets";
import { CategoryCover } from "../../src/components/category-cover";
test("all five configured profiles render exact safe URLs and accessible names", () => {
  const values = {
    github: "https://github.com/example-fixture",
    linkedin: "https://www.linkedin.com/in/example-fixture",
    codeforces: "https://codeforces.com/profile/example-fixture",
    leetcode: "https://leetcode.com/u/example-fixture",
    cses: "https://cses.fi/user/12345",
  };
  const html = renderToStaticMarkup(<SocialLinks values={values} />);
  assert.equal(configuredSocials(values).length, 5);
  for (const [key, url] of Object.entries(values)) {
    assert.ok(html.includes(url), key);
  }
  assert.equal((html.match(/rel="noopener noreferrer"/g) || []).length, 5);
  assert.ok(html.includes("GitHub profile (opens in a new tab)"));
});
test("unconfigured profiles are hidden; unsafe or wrong-domain URLs are rejected", () => {
  assert.equal(
    renderToStaticMarkup(
      <SocialLinks
        values={{
          github: "",
          linkedin: "",
          codeforces: "",
          leetcode: "",
          cses: "",
        }}
      />,
    ),
    "",
  );
  for (const url of [
    "javascript:alert(1)",
    "https://evil.example/person",
    "https://github.com.evil.example/person",
    "https://user:secret@github.com/person",
    "https://github.com/",
  ])
    assert.throws(() => configuredSocials({ ...profile.socials, github: url }));
});
test("document library has honest empty state and meaningful download filenames", () => {
  assert.match(
    renderToStaticMarkup(<DocumentSelector documents={[]} />),
    /once the documents are added/,
  );
  const doc = { ...documents[0], file: "/documents/test-fixture.pdf" };
  const html = renderToStaticMarkup(<DocumentSelector documents={[doc]} />);
  assert.ok(html.includes(`download="${doc.downloadName}"`));
  assert.ok(html.includes("Download Software Engineering Resume (PDF)"));
  assert.ok(
    html.includes(
      "Preview Software Engineering Resume (PDF, opens in a new tab)",
    ),
  );
  assert.ok(html.includes('rel="noopener noreferrer"'));
});
test("PDF existence, signature, safe paths and names gate document links", () => {
  const root = fs.mkdtempSync(path.join(process.cwd(), ".tmp", "asset-test-"));
  try {
    fs.mkdirSync(path.join(root, "documents"));
    fs.writeFileSync(
      path.join(root, "documents", "fixture.pdf"),
      "%PDF-1.7\n% unit fixture only, never published",
    );
    fs.writeFileSync(path.join(root, "documents", "invalid.pdf"), "not a PDF");
    const doc = { ...documents[0], file: "/documents/fixture.pdf" };
    assert.equal(availableDocuments([doc], root).length, 1);
    for (const bad of [
      { ...doc, file: "/documents/missing.pdf" },
      { ...doc, file: "/documents/invalid.pdf" },
      { ...doc, file: "/documents/../fixture.pdf" },
      { ...doc, file: "https://evil.example/file.pdf" },
      { ...doc, downloadName: "../../bad.pdf" },
    ])
      assert.equal(availableDocuments([bad], root).length, 0);
  } finally {
    fs.rmSync(root, { recursive: true });
  }
});
test("photo null/missing fallback never creates broken image elements", () => {
  for (const photo of [
    null,
    {
      src: "/images/missing.jpg",
      alt: "Fixture",
      width: 800,
      height: 1000,
      objectPosition: "50% 50%",
    },
  ]) {
    const html = renderToStaticMarkup(<Photograph photo={photo} />);
    assert.ok(html.includes("A curious mind."));
    assert.ok(!html.includes("<img"));
  }
});
test("valid photograph metadata retains aspect/position and image signature", async () => {
  const root = fs.mkdtempSync(path.join(process.cwd(), ".tmp", "photo-test-"));
  try {
    fs.mkdirSync(path.join(root, "images"));
    await sharp({
      create: { width: 4, height: 5, channels: 3, background: "#cf9874" },
    })
      .png()
      .toFile(path.join(root, "images", "fixture.png"));
    const photo = {
      src: "/images/fixture.png",
      alt: "Synthetic image for an isolated unit test",
      width: 4,
      height: 5,
      objectPosition: "50% 35%",
    };
    assert.deepEqual(availablePhotograph(photo, root), photo);
    assert.equal(availablePhotograph({ ...photo, alt: "" }, root), null);
    assert.equal(
      availablePhotograph({ ...photo, src: "/images/../fixture.png" }, root),
      null,
    );
    assert.equal(
      availablePhotograph({ ...photo, src: "/images/fake.svg" }, root),
      null,
    );
  } finally {
    fs.rmSync(root, { recursive: true });
  }
});
test("three vector concepts and selected favicon dimensions are valid", async () => {
  for (const n of [1, 2, 3]) {
    const source = fs.readFileSync(
      `docs/identity-concepts/concept-${n}.svg`,
      "utf8",
    );
    assert.match(source, /viewBox="0 0 32 32"/);
    assert.ok(!source.includes("<text"));
    for (const size of [16, 32, 64]) {
      const image = await sharp(Buffer.from(source))
        .resize(size, size)
        .png()
        .toBuffer();
      const metadata = await sharp(image).metadata();
      assert.equal(metadata.width, size);
      assert.equal(metadata.height, size);
    }
  }
  for (const size of [16, 32, 64]) {
    const metadata = await sharp(`public/favicon-${size}.png`).metadata();
    assert.equal(metadata.width, size);
  }
  assert.equal((await sharp("public/apple-icon.png").metadata()).width, 180);
  const ico = fs.readFileSync("src/app/favicon.ico");
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico[6], 32);
});
test("real repository asset configuration contains no broken links", () => {
  validateAssetConfiguration();
  configuredSocials();
});
test("photographic assets preserve real dimensions and category availability", async () => {
  const manifest = JSON.parse(
    fs.readFileSync("docs/photograph-manifest.json", "utf8"),
  );
  for (const photo of Object.values(photographs)) {
    if (!photo) continue;
    const metadata = await sharp(path.join("public", photo.src)).metadata();
    assert.equal(metadata.width, photo.width);
    assert.equal(metadata.height, photo.height);
    assert.equal(metadata.exif, undefined);
    const record = manifest.find(
      (item: { output: string }) => item.output === photo.src,
    );
    assert.ok(record);
    assert.ok(record.bytes < record.sourceBytes);
  }
  assert.equal(writingCovers.length, 4);
  assert.deepEqual(
    availableDocuments().map((doc) => doc.id),
    ["software", "machine-learning", "quantitative"],
  );
  assert.equal(documents.find((doc) => doc.id === "academic")?.file, null);
});
test("category cover missing source retains a reserved frame without a broken image", () => {
  const html = renderToStaticMarkup(<CategoryCover photo={null} />);
  assert.ok(html.includes("category-cover-photo"));
  assert.ok(html.includes("category-cover-fallback"));
  assert.ok(!html.includes("<img"));
});
test("configured authentic-photo path uses optimized responsive image markup", async () => {
  const directory = fs.mkdtempSync(
    path.join(process.cwd(), "public", "images", "unit-fixture-"),
  );
  try {
    await sharp({
      create: { width: 4, height: 5, channels: 3, background: "#cf9874" },
    })
      .png()
      .toFile(path.join(directory, "test.png"));
    const src = `/images/${path.basename(directory)}/test.png`;
    const html = renderToStaticMarkup(
      <Photograph
        photo={{
          src,
          alt: "Synthetic unit-test color swatch, not a portrait",
          width: 4,
          height: 5,
          objectPosition: "50% 35%",
        }}
      />,
    );
    assert.ok(html.includes("srcSet="));
    assert.ok(html.includes("/_next/image?"));
    assert.ok(html.includes('width="4"'));
    assert.ok(html.includes('height="5"'));
    assert.ok(html.includes("object-position:50% 35%"));
    assert.ok(html.includes('sizes="(max-width: 700px) 88vw, 42vw"'));
  } finally {
    assert.ok(
      path
        .resolve(directory)
        .startsWith(path.resolve("public/images") + path.sep),
    );
    fs.rmSync(directory, { recursive: true });
  }
});
