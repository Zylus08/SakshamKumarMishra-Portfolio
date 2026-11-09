# Milestone 2.3 — interactive writing gallery and editorial refinements

Date: 2026-11-09 (Asia/Calcutta). Local workspace implementation only.

## Implementation

### Writing gallery

The existing server-validated `CategoryCover` photographs now sit in an expanding button gallery inside `Explorer`. The original Poetry, Personal Reflections, Research Notes, and Engineering image mappings, focal positions, source files, and provenance remain unchanged.

On desktop, four equal-width cards start unselected. Selecting one gives it 2.25 times the flex share of an inactive card. Its image stays in full color; inactive images transition to 80% grayscale and 72% brightness. Labels remain undimmed, and a restrained accent rule marks selection. Frame and caption heights remain reserved during expansion so the results below do not jump vertically.

Search and category controls appear immediately above the gallery. The corresponding results and accurate count appear immediately below it. The same category value drives the gallery, filter buttons, result label, and entry filtering. Search text is retained when switching categories. Clicking the selected category again does not clear selection, replay the result animation, or add a history entry. The archive includes only Published writing; no articles were added. Isolated fixtures in unit tests exercise populated categories, search intersections, and draft-only empty states without publishing invented content.

`?category=Poetry` and other exact category names initialize selection after hydration. Native history updates preserve other query parameters and the hash without a page reload or vertical scroll command. Back/Forward restores category selection through `useSyncExternalStore`; invalid categories display All. The existing archive route and its static generation are retained. Search text remains local component state, as before.

### Homepage

The existing optimized formal headshot moves beside the headline, occupying the former ornament position on desktop. The original text asterisk moves beside the introductory paragraph and is sized at 40px desktop / 32px mobile. The typography and headline scale are unchanged. The asterisk-to-paragraph gap is kept close enough to read as an editorial bullet.

Act V retains its introductory text, lifestyle fallback, and personal note. Immediately after the introduction, two whole-card Next.js Links provide the requested exact headlines, supporting copy, and CTAs to `/writing` and `/about`. No nested interactive controls are used.

## Animation and responsive behavior

- Gallery width and image-filter transitions: 360ms ease. Selection uses CSS flex growth; there is no animation loop or per-frame React state.
- The result region fades from 85% to full opacity and translates upward by 8px over 240ms on category changes. The shallow fade keeps text readable throughout the transition. Typing in search does not remount this transition.
- Editorial links use a 2px upward hover motion and subtle border-color transition over 180ms.
- At 900px and below, cards keep a readable 74% strip width, capped at 370px, with native horizontal scrolling. No wheel/touch handlers, snapping, or vertical scrolling overrides are added. Keyboard focus and category changes reveal a clipped card by moving only this strip, instantly.
- At 1100px and below, the headshot sits beneath the full-width headline at 105px wide, preserving typographic scale and preventing overlap. It remains 155px wide alongside the headline on larger screens. Responsive image `sizes` reflect these breakpoints.
- The two Act V links use two columns on desktop and one column at 700px and below.
- `prefers-reduced-motion` disables gallery, results, and hover animation. Selection and filtering continue to work.

## Accessibility

Cards are semantic buttons with descriptive names, `aria-pressed`, and `aria-controls` pointing to the result region. Native Enter/Space activation and Tab order are retained. Visible focus rings have room inside the mobile scroll strip. The live result count announces category and count changes; the labeled result region retains the existing empty state. Images keep their authentic descriptive alternatives. Whole-card editorial links expose their headlines and CTA text as link content. Both themes retain the existing color tokens.

## Files modified

- `src/components/explorer.tsx` — connected selection/history, gallery, result transition, published writing filter, and horizontal focus visibility.
- `src/lib/explorer-filter.ts` — shared pure entry-filtering function and item type, tested with isolated fixtures.
- `src/components/category-cover.tsx` — responsive sizes for the expanded desktop and mobile strip presentations.
- `src/components/photograph.tsx` — compact portrait sizes aligned with the new hero breakpoint.
- `src/app/page.tsx` — hero photo/asterisk swap and two Act V links.
- `src/app/globals.css` — gallery transitions, mobile strip, hero composition, and editorial link layout.
- `tests/unit/explorer.test.tsx` — populated category/search/draft-only fixtures.
- `tests/milestone-2-3.spec.ts` — targeted gallery, history, keyboard, motion, themes, hero, and navigation tests.
- `tests/milestone-2.spec.ts`, `tests/portfolio.spec.ts` — wait for existing button color transitions before contrast scans and establish header hydration before exercising its global keyboard shortcut; contact and navigation implementation remains unchanged.
- `docs/MILESTONE-2.3-REPORT.md` — this handoff.

Primary navigation, research/project content files, contact API, résumé configuration, professional profiles, favicon, image files, and photographic provenance were not modified. The homepage still has six acts and the primary navigation still has five tabs.

## Screenshots

Captured under ignored `artifacts/milestone-2.3/` for both `desktop` and `mobile`:

- `{project}-gallery-dark.png` and `{project}-gallery-light.png`
- `{project}-hero-dark.png` and `{project}-hero-light.png`
- `{project}-personal-dark.png` and `{project}-personal-light.png`

These twelve screenshots cover active/inactive imagery, visible focus, both themes, the headline portrait and paragraph asterisk, and the editorial navigation layout. Existing responsive/crop tests also capture 320, 390, 768, and 1280px views under `artifacts/photography/`. Screenshot review prompted the closer desktop bullet spacing and mobile active-card visibility refinement before final verification.

## Actual verification results

| Check                            | Actual result                                                                                                                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript                       | PASS — `npm run typecheck` and production-build typecheck                                                                                                                                                                   |
| ESLint                           | PASS — `npm run lint`, exit 0                                                                                                                                                                                               |
| Content/configuration validation | PASS — six unchanged MDX entries plus profile/asset integrity checks                                                                                                                                                        |
| MDX tests                        | PASS — math, code, and custom component compilation fixture                                                                                                                                                                 |
| Unit tests                       | PASS — 35 tests, zero failures, sequential execution                                                                                                                                                                        |
| Production build                 | PASS — 19 static outputs; archive routes remain statically generated                                                                                                                                                        |
| Final Playwright run             | PASS — 38 tests, zero failures, 1.3 minutes                                                                                                                                                                                 |
| Accessibility                    | PASS — no axe violations in the tested route scans and dark/light gallery/contact states                                                                                                                                    |
| Responsive/layout checks         | PASS — no horizontal page overflow at 320, 390, 768, and 1280px; 24 route/viewport shift measurements, maximum 0.000393895 (threshold 0.1)                                                                                  |
| Targeted interaction checks      | PASS — equal widths, 2–2.5× expansion, inactive image filters, category/search state, repeat selection, Back/Forward, deep links, keyboard focus, mobile strip, reduced motion, hero placement, and both Act V destinations |
| Existing regressions             | PASS — five-tab navigation, six homepage acts, profile URLs, résumé availability, contact validation/mock mode/rate limiting, metadata, filters, and command palette                                                        |
| Formatting                       | PASS — changed source/test files checked with Prettier                                                                                                                                                                      |

The first complete run passed all 35 unit tests and all 38 desktop/mobile browser tests. The screenshot-driven refinement pass exposed a mobile scroll-snap/focus conflict, a transient low-contrast results fade, and two existing test timing races. Snapping was removed, the fade now starts at readable opacity, and the existing contrast/shortcut tests wait for settled UI state. The final complete rerun passed all 38 tests; no failures were skipped or treated as passes. Refreshed screenshots confirm the selected mobile card and label are fully visible and the desktop asterisk is adjacent to its paragraph.

The browser server runs on isolated local port 3100 with explicit mock transport and blank email-provider credentials. Tests use installed Chrome with desktop and iPhone 13 Chromium emulation. This is not a claim of physical-device or Safari testing. Unit tests run sequentially to respect local memory constraints; the existing two-worker production-build option is retained.

## Remaining issues and launch dependencies

No unresolved Milestone 2.3 test failures remain. The twelve milestone screenshots are local ignored artifacts; the HTML browser report is under `playwright-report/` and layout measurements are under `artifacts/photography/`.

No writing entries have been supplied; category empty states are intentional. Existing launch dependencies remain: reconcile the résumé PDFs' IIT Bombay education with the website's Thapar profile, supply an academic CV if desired, verify pending research/project content, and configure/authorize live email separately if required. Codeforces remains hidden pending a valid profile.

No push, deployment, DNS changes, or live email sends were performed.
