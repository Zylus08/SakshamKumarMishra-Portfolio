# Testing and milestone report

Date: 8 November 2026 (Asia/Calcutta).

## Verdict

**Application build ready for Vercel; public content approval remains pending.** No deployment, DNS change, purchase, remote push, or publication was performed. The local production server used for testing was automatically stopped by Playwright.

## Executed checks

| Check                      | Actual result                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`        | PASS, exit 0, strict TypeScript                                                                                                       |
| `npm run lint`             | PASS, exit 0, no errors or warnings in final run                                                                                      |
| `npm run validate:content` | PASS, six entries, unique slugs, schema rejection and content integrity                                                               |
| `npm run test:mdx`         | PASS, separate unpublished fixture compiled math, code, and custom components                                                         |
| `npm run build`            | PASS, Next.js 16.4.5 / Webpack, all 17 static outputs generated                                                                       |
| Playwright desktop         | Six checks passed across final suite plus targeted timeout rerun                                                                      |
| Playwright mobile          | Six checks passed in final suite                                                                                                      |
| Axe accessibility          | No violations for tested WCAG 2 A/AA, 2.1 AA, 2.2 AA tags across all 11 content routes at both viewports; light homepage also scanned |
| Responsive overflow        | No horizontal overflow on the 11 routes at desktop 1280x720 and emulated iPhone 13 390x664                                            |
| Visual inspection          | Desktop 1440x1000 and mobile 390x844 full-page homepage screenshots reviewed                                                          |
| `npm audit --json`         | PASS, zero vulnerabilities after targeted transitive dependency overrides                                                             |
| Reference inspection       | All three provided URLs returned HTTP 200 in Chrome; desktop/mobile snapshots inspected                                               |

The twelve Playwright checks cover route rendering, console page errors, landmarks and contrast, six homepage acts, five-tab navigation, mobile navigation, project search/category/list-grid/empty-state behavior, research status filtering, command shortcut and Enter navigation, Escape and focus restoration, theme persistence, reduced motion, metadata, sitemap/robots/social image, and real 404 status codes.

The final full suite had **11 passes and one timeout** in the desktop test that sequentially scans eleven routes with axe, while screenshot capture ran concurrently. Its timeout was increased from 30 to 120 seconds, then `npm test -- --last-failed` passed that remaining check in 15.5 seconds (19.2 seconds including setup). All twelve unique checks therefore passed on the final application. The latest HTML report contains the targeted rerun; this document preserves the combined result accurately.

## Issues found and fixed

- Initial npm access was restricted; authorized installation succeeded using a workspace-local cache because C: was full.
- The initial Turbopack compile stalled in the local environment. The production build uses the supported Webpack path; it successfully compiles and prerenders the complete site.
- The Open Graph image initially lacked an explicit flex container. Static generation caught it; the corrected image builds and responds successfully.
- Initial entrance opacity temporarily reduced hero text contrast. Entry motion now preserves full opacity.
- Enter navigation initially refocused the palette trigger and allowed the native key default to reopen the dialog. Preventing that default fixed the bug; keyboard navigation now passes on both viewports.
- The KaTeX and lint-toolchain nested dependencies initially produced audit findings. Narrow overrides use patched versions; production build, MDX math compilation, lint, and type checks pass with those overrides.
- The MDX fixture initially ran through a CommonJS-oriented TypeScript wrapper, exposing an ESM-only package boundary. It now runs as a dedicated `.mjs` test and passes.

## Created files

The workspace was empty, so all deliverables are new files.

- Application: `src/app/layout.tsx`, `page.tsx`, `globals.css`, `about/page.tsx`, `[collection]/page.tsx`, `[collection]/[slug]/page.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, `icon.svg`, `opengraph-image.tsx`.
- Shared behavior: `src/components/header.tsx`, `explorer.tsx`, `field.tsx`, `reveal.tsx`, `diagram.tsx`, `contact.tsx`.
- Content: `src/lib/content.ts`, `profile.ts`; three research MDX files and three project MDX files under `src/content`. Writing intentionally has no published entries.
- Tooling: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `playwright.config.ts`, `.gitignore`, `.prettierignore`, `.env.example`.
- Verification: `tests/portfolio.spec.ts`, `scripts/validate-content.ts`, `validate-mdx.mjs`, `capture.mjs`, `inspect-references.mjs`, `seed-content.mjs`.
- Handoff: `README.md` and six documents in `docs/`.
- Local ignored evidence: screenshots and audit JSON in `artifacts/`, browser report in `playwright-report/`. They are not required for deployment.

## Known limitations and remaining blockers

- Verified email, social profile URLs, CV, research stages, repositories, methods, dates, and outcomes were not supplied. Links are omitted rather than fabricated; pending case studies are explicitly labeled and noindex.
- IIT Jodhpur experience and collaborators are not listed without confirmation.
- Writing route and MDX template work, but there are no genuine authored entries supplied.
- No actual performance benchmarks are claimed. Diagrams are clearly conceptual.
- Automated Chromium coverage and axe scans are not a full WCAG certification. Safari/Firefox, physical mobile devices, manual screen-reader navigation, and real-user performance remain untested.
- Lighthouse was not run; no Lighthouse score, field LCP, CLS, or INP is claimed.
- Domain ownership, DNS, TLS, remote repository integration, and production hosting remain unverified because deployment is outside authorization.
- Contact is link-based; no backend or message submission form is included.
- Draft MDX is publicly readable when placed in a content collection. The content system is repository-owned, not a private CMS.

## Next iteration

1. Complete the verification checklist, add the actual CV and contact channels, and replace topic outlines with evidenced case studies.
2. Add original writing and owned photography if desired.
3. Run Lighthouse on the approved Vercel preview, then test Safari, Firefox, screen readers, and physical devices.
4. Add CI using the documented validation commands once a repository is authorized.
5. Consider richer scientific visual abstracts only when verified data makes them useful.
