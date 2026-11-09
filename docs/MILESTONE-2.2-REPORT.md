# Milestone 2.2 — authentic photography and résumé assets

Date: 2026-11-08. Local implementation only; no push, deployment, DNS change, or live email.

## Repository audit and preserved interfaces

- `src/lib/assets.ts` owns typed `Photograph` and `ProfessionalDocument` configuration. `src/lib/asset-files.ts` gates local assets by safe path, existence, and file signatures. The content validator checks configured assets.
- `Photograph` already supports reserved image frames, `next/image`, focal positions, and a text fallback. It serves Home and About; the existing lifestyle slot remains unconfigured.
- The homepage retains all six acts and its typography-first hero. The compact portrait remains 105px on mobile / 155px on desktop; its frame is now 4:5 to preserve the headshot composition.
- The writing archive uses `Explorer` with search/category filters and an honest empty state. Four reusable `CategoryCover` photographs now select those existing filters even with no articles. Essays remains an existing filter without an invented cover or article.
- The résumé disclosure and About library both consume `availableDocuments()`. Their existing preview/download behavior is retained. All five primary tabs remain unchanged.
- Existing tests cover configuration, asset fallbacks, contact validation/rate limiting, profiles, navigation, MDX, accessibility, themes, and responsive layouts. New tests cover actual photo dimensions, category covers, PDF responses, and observed layout shifts.

## Photographs actually integrated

All seven supplied JPEGs were visually inspected before mapping. Five distinct originals serve six intended placements:

| Placement            | Verified original                                   | Served file                         | Original/output dimensions |   WebP bytes |
| -------------------- | --------------------------------------------------- | ----------------------------------- | -------------------------- | -----------: |
| Homepage             | `headshot.jpeg` — formal grey suit and tie          | `formal-headshot.webp`              | 978 × 1280                 |       52,876 |
| About                | `sunlit outdoor.jpeg` — outdoor black sweater       | `outdoor-black-sweater.webp`        | 832 × 1280                 |       71,920 |
| Poetry               | `orange_navyblue jacket.jpeg` — hand under chin     | `poetry-portrait.webp`              | 798 × 1280                 |       94,242 |
| Personal Reflections | `arms rested.jpeg` — crossed arms, dark background  | `reflections-portrait.webp`         | 1280 × 1125                |       77,958 |
| Research Notes       | Same verified outdoor black-sweater source as About | Shared `outdoor-black-sweater.webp` | 832 × 1280                 | No duplicate |
| Engineering          | `green t shirt.jpeg` — green T-shirt mirror selfie  | `engineering-portrait.webp`         | 1080 × 1151                |       61,692 |

`casual researcher.jpeg` is an indoor T-shirt mirror selfie, not an outdoor sweater portrait. `suited up.jpeg` is a suit mirror selfie, not the requested formal headshot. Neither is published or substituted into another slot.

### Optimization and art direction

`scripts/optimize-photographs.mjs` uses Sharp, auto-orientation, and WebP quality 85 / effort 6. No source resizing/upscaling, geometric distortion, facial editing, artificial blur, or color filters were applied. Natural source light provides the contrast. Source dimensions/aspect ratios are retained in the files; CSS object-fit crops within reserved frames with explicit focal positions. Covers use 4:5 desktop and square mobile frames. Existing restrained reveals are reused, with reduced-motion support.

The five served files total 358,688 bytes (about 350 KiB), down from 459,020 bytes of source JPEGs: 21.9% smaller. Additional AVIF copies were unnecessary. Next Image supplies responsive browser renditions; explicit dimensions/sizes reserve layout space, the compact homepage portrait is preloaded, and other photographs load lazily.

The first cold desktop-browser run exposed a 0.144 homepage layout-shift score at 320px. Inspection traced it to late Space Grotesk loading changing headline wrapping, not the image dimensions. `next/font/local` now preloads the same installed Space Grotesk, Instrument Serif, and JetBrains Mono files and supplies adjusted fallback metrics. The typography/design system is unchanged. The final browser suite checks full-page shift scores below 0.1 in addition to reserved image frames.

Originals remain byte-for-byte preserved in ignored `assets/source-photos/`, outside the public asset tree. Keep these local files backed up separately; a clean checkout of the served files does not include them. `docs/photograph-manifest.json` records original SHA-256 identities and output sizes/dimensions. Only one optimized copy of each selected source is public.

### Missing or optional photographs

- No second distinct outdoor black-sweater portrait was supplied. The one authentic source satisfies both About and Research Notes; supply another only if separate compositions are desired.
- No source was designated for the existing Beyond the Terminal lifestyle slot. Its designed fallback remains.
- No invented portraits or stock substitutes were added.

## Résumé integration

The three supplied PDFs were parsed, their names/contact identity and category content checked, and all four pages rendered and visually inspected. Original PDF bytes are unchanged.

| Category               | Public document                   | Pages | State                          |
| ---------------------- | --------------------------------- | ----: | ------------------------------ |
| Software Engineering   | `Saksham_Mishra_SWE_Resume.pdf`   |     1 | Download and preview available |
| Machine Learning / AI  | `Saksham_Mishra_ML_Resume.pdf`    |     1 | Download and preview available |
| Quantitative Research  | `Saksham_Mishra_Quant_Resume.pdf` |     2 | Download and preview available |
| Academic / Research CV | None supplied                     |     — | `null`; no fabricated link     |

**Content review needed before launch:** all supplied PDFs list IIT Bombay, while the website lists Thapar Institute of Engineering & Technology. Resolve this with the authentic corrected documents or a confirmed profile correction. Résumé performance metrics, employment/education statements, and achievements were not independently authenticated. They were not copied into verified website content. PDF accessibility tagging has not been certified; browser axe results cover the website, not PDF accessibility.

## Verification outcomes

| Check                                 | Result                                                                                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Complete unit suite                   | PASS — 32 tests, zero failures, sequential execution                                                                                                      |
| TypeScript                            | PASS — `npm run typecheck`, exit 0; build typecheck also passed                                                                                           |
| ESLint                                | PASS — `npm run lint`, exit 0                                                                                                                             |
| Content/configuration validation      | PASS — six existing MDX entries and profile/asset validation                                                                                              |
| MDX compilation                       | PASS — math, code, and custom component fixture                                                                                                           |
| Production build                      | PASS — `npm run build`, 19 static outputs, contact API remains dynamic                                                                                    |
| Formatting of changed source/tests    | PASS — Prettier check                                                                                                                                     |
| Final desktop/mobile browser suite    | PASS — 32 tests, zero failures, 4.0 minutes                                                                                                               |
| Accessibility                         | PASS — zero axe violations in the tested route scans, contact themes, and writing light theme                                                             |
| Responsive/crop checks                | PASS — Home, About, and Writing at 320, 390, 768, and 1280px in both browser projects; no horizontal overflow or broken images                            |
| Layout stability                      | PASS — 24 route/viewport measurements; maximum summed unexpected layout shift 0.00077003, below 0.1; all other measurements zero                          |
| Contact/profile/navigation regression | PASS — four exact profile URLs, Codeforces omitted, five primary tabs and six homepage acts retained, mock-only forms, validation and rate-limit behavior |

No unresolved test failures remain. The final browser run confirms actual image responses and exact section/category mappings, cover filtering with an empty archive, three genuine PDF responses/download paths, no academic-CV link, fallback rendering, keyboard/menu behavior, themes, and reduced motion. Provider responses in unit/browser tests are mocked; no real email request was made. The isolated Playwright server was managed and stopped by the test runner.

Unit execution used `node node_modules/tsx/dist/cli.mjs --test --test-concurrency=1 tests/unit/*.test.tsx`, with local temporary files on E: and `GOMAXPROCS=2`. Production builds retain the existing local two-worker setting. Browser tests use installed Chrome with desktop and iPhone 13 Chromium emulation, an isolated port 3100 server, explicit mock contact mode, and blank provider credentials. They do not certify Safari or a physical device.

The first browser run found the font-related layout shift described above and was interrupted while waiting on the old mobile résumé dismissal target. After the font fix, a complete browser run passed 31 checks and confirmed the remaining test issue: the now-populated mobile résumé popover covers the heading that the old test tried to click. The test now clicks the actual outside gutter, preserving Escape and outside-dismissal assertions. The final full suite was rerun after that correction. No layout-shift threshold or product behavior was weakened to obtain a pass.

Screenshots and per-route/per-width layout measurements are stored locally under ignored `artifacts/photography/`; the Playwright HTML report is under ignored `playwright-report/`. Visual inspection covers the actual optimized headshot, outdoor portrait, all four category crops at narrow and wide layouts, and every supplied PDF page. These are local laboratory checks rather than field performance measurements.

## Files changed

- `src/lib/assets.ts` — typed photo mappings, four category covers, three real PDF paths; academic CV/lifestyle remain null.
- `src/components/photograph.tsx` — accurate compact responsive sizes and homepage preload.
- `src/components/category-cover.tsx` — reusable server-validated cover image/fallback.
- `src/components/explorer.tsx` — cover buttons tied to existing category filtering and truthful empty archive.
- `src/app/about/page.tsx`, `src/app/[collection]/page.tsx` — correct photography and existing reveal wrapper.
- `src/app/globals.css` — restrained cover frames/responsive grid and portrait hero frame.
- `src/app/layout.tsx` — existing local typefaces loaded through Next's preloading/metric-adjusted font pipeline to fix the observed layout shift.
- `scripts/optimize-photographs.mjs`, `.gitignore` — reproducible optimization and private local source retention.
- `public/images/*.webp` — five optimized files listed above; original JPEGs moved to local source storage.
- `tests/unit/assets.test.tsx`, `tests/milestone-2.spec.ts`, `tests/milestone-2-2.spec.ts` — updated availability assertions and asset/layout verification.
- `docs/photograph-manifest.json`, `docs/IDENTITY-ASSETS.md`, `docs/RESUME-LIBRARY.md`, this report — provenance and handoff.
- `README.md`, `docs/CONTENT-VERIFICATION.md` — current milestone link, supplied assets, and résumé content discrepancy.
- Three user-supplied `public/documents/*.pdf` files are integrated without modification.

## Remaining launch dependencies

- Resolve the résumé/website education discrepancy and review supplied résumé claims before publication.
- Supply the academic CV if its category should become available; optional distinct About and lifestyle photos can be added through the existing configuration.
- Existing research/project verification remains pending; this milestone invents no articles or results.
- Codeforces remains hidden until a valid new profile is supplied.
- Contact remains explicitly mock. Live sending still requires authorization, verified permitted-subdomain sender, Resend/shared Redis configuration, and a stable rate-limit secret. The Gmail address remains only the recipient/fallback address.
- No push, deployment, DNS operation, or real email was performed.
