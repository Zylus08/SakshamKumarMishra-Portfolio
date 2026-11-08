# Professional identity and visual assets

## Professional profiles

Edit `profile.socials` in `src/lib/profile.ts`. The typed keys are `github`, `linkedin`, `codeforces`, `leetcode`, and `cses`. Milestone 2.1 configures the four user-supplied GitHub, LinkedIn, LeetCode, and CSES URLs. Codeforces remains empty and hidden pending a new valid account. Paste the complete HTTPS profile URL, not a username. `configuredSocials()` validates the corresponding platform host and rejects credentials, non-HTTPS URLs, and root/homepage URLs. Do not add example accounts to production.

`SocialLinks` is reused in the About contact block, homepage contact area, footer, and Contact page. It renders an accessible platform name, a compact text mark, and external-link indication. Outbound anchors open a new tab with `noopener noreferrer`. Empty entries produce no links. The command palette also includes configured profiles. No statistics or rankings are fetched or invented.

## Photographs

Place authentic images in `public/images/`. Configure `photographs.portrait` and `photographs.lifestyle` in `src/lib/assets.ts`; leave either `null` to retain the designed text fallback.

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

`Photograph` validates local existence and image signature, then uses Next Image with explicit dimensions, responsive `sizes`, a reserved aspect ratio, lazy loading, and configurable crop position. The homepage compact portrait, About portrait, and Beyond the Terminal image share this component. Missing or invalid assets render text, never an invented portrait. `npm run validate:content` fails for configured but invalid assets so publishing mistakes are visible. File signature checks do not replace reviewing the image itself.

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
