# M3 content and verification report

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

## Integrated content

144 repositories discovered; 81 snapshots pinned; 79 trees retrieved. Inspection depth varies and is disclosed in [the inventory](M3-GITHUB-INVENTORY.md). The 24 selected project entries and the SleepApnea research note received implementation-level review. Organization-only discovery is not counted as deep source inspection.

24 project entries: 3 flagships, 13 other full case studies, 7 archive entries, 1 experiment. Five research entries: two new, one substantially updated, two retained as unfeatured verification-pending placeholders. Seven homepage projects and three homepage research notes. Six project categories, existing five-tab navigation, authentic photos, three résumé PDFs, writing empty states, and mock-only contact preserved.

Repository dispositions sum to 144: 24 selected project repositories, one additional selected research repository, two consolidated personal forks, 16 private repositories held from publication (14 owned plus two collaborative), 62 organization-only attribution screens, and 39 other excluded/manual-review repositories. The last group includes routine coursework, small demos, unresolved contribution scope, and unmerged proposals; it is not a claim that every one is technically deficient.

| Project category | Entries |
|---|---:|
| Machine Learning & AI | 6 |
| Quantitative Finance | 7 |
| Systems & Infrastructure | 3 |
| Applications & Engineering | 5 |
| Scientific Computing & Simulation | 2 |
| Experimental & Emerging Work | 1 |

## Verification

Final application checks were executed on 2026-11-09 against the local production build:

| Check | Actual outcome |
|---|---|
| TypeScript (`npm run typecheck`) | Passed; production build also completed its TypeScript stage. |
| ESLint (`npm run lint`) | Passed. |
| Configuration/content (`npm run validate:content`) | Passed for all 29 MDX entries, asset configuration, and configured profiles. |
| MDX (`npm run test:mdx`) | All 29 actual documents compiled; math/code/component fixture passed; literal diagram labels retained and JavaScript expressions blocked. |
| Unit tests | 38 passed, 0 failed; includes catalogue integrity, safe URLs, photos/PDFs, profiles, contact validation, mocked provider behavior, and rate limiting. |
| Production build (`npm run build`) | Passed with Webpack and two workers; 42 static pages generated. |
| Full Playwright desktop/mobile suite | 99 passed in 3.7 minutes; one desktop photography navigation was interrupted by host sleep (`ERR_NETWORK_IO_SUSPENDED`). |
| Unchanged interrupted test rerun | 1 passed in 17.1 seconds, including 11.8 seconds test time. All 100 cases therefore have passing results across the full run and targeted rerun; this is not claimed as one uninterrupted 100-pass run. |
| Accessibility/responsive | Axe WCAG-tag checks passed for every catalogue route in desktop and mobile, with no page overflow; desktop prose-column width/placement and actual diagram labels asserted. Existing keyboard, theme, navigation, gallery, and contact checks passed. |
| Photography layout shift | At 320, 390, 768, and 1280 px, recorded maximum was 0.0007700304 in the desktop project and 0 in the mobile project, below the existing 0.1 threshold. |
| Visual inspection | Six refreshed desktop/mobile screenshots reviewed: quant directory, homepage project panel, and Thermodynamic Evolution article. Desktop reading column and mobile labels fit after repairs. |
| Report integrity | All nine required reports exist; relative report links resolve. `git diff --check` passed. |
| Upstream RiskLab subset | 13 passed in 0.88 seconds across four isolated existing pytest modules. Not the full upstream suite. |
| Isolated upstream audit probes | Reproduced TradeCore's empty-benchmark false success and DeepHedge-RL's in-the-money put-delta edge behavior. These reproduce defects, not passing correctness or performance claims. |

Execution environment: Windows PowerShell, installed Chrome via `PLAYWRIGHT_CHANNEL=chrome`, isolated port 3100 via `SKM_TEST_PORT=3100`. Test-server configuration explicitly forced mock contact transport and empty live-provider/Redis credentials. Provider-acceptance unit/UI scenarios use mocks; no live email was sent. Playwright's owned server stopped after the runs.

During verification, malformed URL input exposed a throwing schema refinement; it now returns a validation failure. Initial browser fixture assumptions were updated to the new catalogue count and the actual anchor structure without removing coverage. Visual inspection then prompted the desktop layout and literal-diagram fixes described below. Final results above apply after those fixes. Earlier interrupted runs are not counted as successful full runs. Raw run logs and screenshots remain local under ignored `.tmp/` and `artifacts/` directories.

## Remaining blockers

- No release authorization: no push, deployment, DNS change, or live mail performed.
- Public evidence gaps: MobileLoRA unresolved; private H-STAR details withheld; HCL remote snapshot unavailable; oversized Urja trees and remaining collaborative scope require manual review. Full histories and all upstream CI runs were not exhausted.
- Scientific and engineering claims remain bounded by the defects and evaluation limitations in the audit reports. No performance headline is independently replicated.
- Academic CV absent. Existing affiliation discrepancy between supplied résumé and website remains unresolved; this milestone invents no affiliation and changes no PDF.
- Live contact remains deliberately disabled pending separately verified sender, provider credentials, shared limiter, and explicit authorization.

## Files changed in this milestone

Project and research MDX under `src/content`; `src/lib/content.ts`; new `src/lib/project-categories.ts`; `src/lib/explorer-filter.ts`; `src/components/explorer.tsx`; `src/components/diagram.tsx`; `src/app/page.tsx`; a desktop contents-layout repair in `src/app/globals.css`; `scripts/validate-mdx.mjs`; `tests/portfolio.spec.ts`; new `tests/unit/catalogue.test.tsx` and `tests/milestone-3.spec.ts`; README and content-verification/authoring guidance; the nine `docs/M3-*.md` reports. Earlier milestone changes remain in the shared working tree and are not attributed to this milestone. Raw private audit material remains ignored under `.tmp/`.

Visual review caught a pre-existing collision with the Tailwind `contents` utility, which collapsed the article sidebar and left prose in the narrow grid column. The sidebar now explicitly remains a block. Diagram labels use literal string attributes because the installed MDX compiler intentionally removes JavaScript attribute expressions. JavaScript blocking remains enabled. Browser checks now assert desktop prose width/placement and the actual Thermodynamic Evolution diagram labels, rather than merely checking the absence of overflow.

## Audit report index

- [GitHub inventory and every repository disposition](M3-GITHUB-INVENTORY.md)
- [Technical audit and contribution attribution](M3-TECHNICAL-AUDIT.md)
- [Portfolio selection and category membership](M3-PORTFOLIO-SELECTION.md)
- [Quantitative finance audit](M3-QUANT-FINANCE-AUDIT.md)
- [Thermodynamic Evolution audit](M3-THERMODYNAMIC-EVOLUTION-AUDIT.md)
- [Aerospace RUL audit](M3-AEROSPACE-RUL-AUDIT.md)
- [Big Five chatbot audit](M3-BIG-FIVE-CHATBOT-AUDIT.md)
- [Claim provenance](M3-CLAIM-PROVENANCE.md)
