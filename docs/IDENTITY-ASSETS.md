# Professional identity and visual assets

## Professional profiles

Edit `profile.socials` in `src/lib/profile.ts`. The typed keys are `github`, `linkedin`, `codeforces`, `leetcode`, and `cses`. Milestone 2.1 configures the four user-supplied GitHub, LinkedIn, LeetCode, and CSES URLs. Codeforces remains empty and hidden pending a new valid account. Paste the complete HTTPS profile URL, not a username. `configuredSocials()` validates the corresponding platform host and rejects credentials, non-HTTPS URLs, and root/homepage URLs. Do not add example accounts to production.

`SocialLinks` is reused in the About contact block, homepage contact area, footer, and Contact page. It renders an accessible platform name, a compact text mark, and external-link indication. Outbound anchors open a new tab with `noopener noreferrer`. Empty entries produce no links. The command palette also includes configured profiles. No statistics or rankings are fetched or invented.

## Photographs

Optimized authentic images live in `public/images/`. Configure `photographs` in `src/lib/assets.ts`: `portrait` for the compact homepage, `about` for the outdoor portrait, and `poetry`, `reflections`, and `engineering` for writing covers. Research Notes reuses `about` because only one outdoor black-sweater source was supplied. `lifestyle` remains `null`, retaining its designed text fallback. `writingCovers` maps the four categories to these shared records without duplicating image configuration.

Original JPEGs are preserved unchanged in ignored `assets/source-photos/`, outside the public directory. Keep a separate backup of these local originals. Run `node scripts/optimize-photographs.mjs` to regenerate the five WebP files at quality 85. The script auto-orients and strips metadata, without resizing, upscaling, retouching, or color grading; `docs/photograph-manifest.json` records source identities, SHA-256 hashes, dimensions, and byte sizes. No duplicate AVIF variants are needed for these small sources; Next Image supplies responsive renditions. The unused suit mirror selfie and indoor T-shirt photo are retained locally, not published.

Each configured object contains:

```ts
{
  src: '/images/your-authentic-portrait.webp',
  alt: 'A specific, accurate description of the supplied photograph',
  width: 1200,
  height: 1500,
  objectPosition: '50% 35%'
}
```

The sample is configuration syntax, not a supplied asset. Use real source dimensions. Recommended portrait: 1200x1500 (4:5); lifestyle: 1400x1400 or a larger source cropped to the square display. Use JPEG, WebP, or PNG; remove unnecessary EXIF/location data before publication and aim for a well-compressed source under 500 KB. Paths must be local, under `/images/`, and use letters, digits, slashes, hyphens, or underscores. Object position uses two percentages.

`Photograph` validates local existence and image signature, then uses Next Image with explicit source dimensions, responsive `sizes`, a reserved frame, and configurable crop position. Only the compact homepage portrait is preloaded; other images are lazy-loaded. The homepage compact portrait, About portrait, and Beyond the Terminal fallback share this component. `CategoryCover` uses the same validation and responsive Next Image treatment in reserved 4:5 desktop / square mobile frames. Covers select the existing Explorer filters and remain present for empty categories. Object-fit cropping never stretches the source. Missing or invalid assets render fallbacks, never invented portraits. `npm run validate:content` fails for configured but invalid assets so publishing mistakes are visible. File signature checks do not replace reviewing the image itself.

Scroll reveals reuse the existing homepage system; reduced motion remains supported. Frames reserve space before images load to avoid layout jumps.

## Monogram and favicon

Three original vector concepts are preserved in `docs/identity-concepts/`:

1. Linear initials: separate geometric S, K, M. Best letter separation at 16px; clear at 32/64px.
2. Shared-spine atelier: stronger vertical silhouette at 64px, but the K/M junction crowds at 16px.
3. Framed wordmark: clear at 64px, but the frame consumes useful letter space at 16px.

All three were rasterized and visually compared at 16, 32, and 64px on warm-paper and dark surfaces. Concept 1 was selected, with a restrained amber baseline. The dark badge keeps contrast consistent in both themes. The navbar/footer `BrandMark` uses identical vector paths beside the existing editorial SKM wordmark.

`npm run identity:generate` regenerates:

- `src/app/icon.svg` — scalable App Router icon.
- `src/app/favicon.ico` — 32px PNG-backed ICO for legacy favicon discovery.
- `public/favicon-16.png`, `favicon-32.png`, `favicon-64.png`.
- `public/apple-icon.png` — 180px touch icon.
- `artifacts/identity-concepts.png` — local comparison sheet, ignored by Git.

`src/app/layout.tsx` declares PNG and Apple metadata; Next.js also discovers the SVG and ICO files. `BrandMark` must be updated alongside source paths if redesigning the mark. No stock symbol, emoji, font glyph, or generated portrait is used as the favicon.
