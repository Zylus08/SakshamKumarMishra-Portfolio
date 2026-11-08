# Milestone 2 — Professional identity, assets, and contact

Completed locally on 8 November 2026 (Asia/Calcutta).

## Verdict

**Implementation complete and production-build ready. Live contact sending and personal assets remain configuration-dependent.** Existing routes, six homepage acts, themes, command palette, archives, MDX, and reduced-motion behavior remain functional. The five primary tabs are unchanged. No remote push, production deployment, live email transmission, provider-account provisioning, or DNS mutation occurred.

## Repository audit

The existing Next.js 16.4.5 / React 19.3.1 application, content, components, tests, and documentation were inspected before editing. The folder is still not a Git repository. Milestone 1's reports were treated as history, and behavior was verified again. Its component and content architecture was extended rather than rebuilt.

## Features completed

- Central typed configuration for GitHub, LinkedIn, Codeforces, LeetCode, and CSES. Reusable secure, accessible SocialLinks renders only configured profiles. About, footer, homepage contact, Contact page, and command palette use the configuration.
- Four-category resume/CV library with title, description, type, meaningful download filenames, and preview links. File existence/signature/path checks prevent broken links. Native navbar disclosure supports keyboard activation, Escape/focus return, and outside-pointer dismissal; About reuses the selector. Unavailable documents have an explicit empty state.
- Three code-generated SVG identity concepts evaluated at 16/32/64px on both backgrounds. Linear initials selected for legibility; original amber-accent SVG, PNG, ICO, Apple icon, and matching navbar/footer BrandMark implemented.
- Next Image portrait and lifestyle components with responsive sizes, explicit dimensions, fixed frames, custom crop position, descriptive alt text, and existing scroll-reveal integration. Authentic assets are optional; complete text-led fallbacks are shown now.
- Functional homepage and `/contact` forms. `/api/contact` uses server-side validation, a mock adapter, and a production Resend REST transport. Contact is discoverable without adding a sixth navbar tab.
- Accessible status messages for validation, submitting, mock results, provider acceptance, rate limits, and failures. Mock mode never pretends to send; provider acceptance never claims delivery.

## Security summary

The server enforces a 16 KiB streamed-body cap, strict Zod field validation, email/header-control checks, a honeypot, exact Origin validation, and cross-site Fetch Metadata rejection. Recipient and sender are fixed by server configuration; the visitor address is used only as Reply-To. Unknown sender/recipient/HTML fields are rejected. The notification has both literal plain text and escaped HTML, plus a timestamp. Messages and provider error details are not logged or exposed to visitors.

Live sending requires an explicit transport setting, verified-subdomain From address, provider credentials, shared Redis credentials, and a HMAC secret. An atomic shared limiter enforces global/email/trusted-Vercel-IP attempt limits with expiring keys. Failure of the shared limiter prevents sending; there is no live-mode memory fallback. Mock mode uses a bounded in-process limiter and makes no external calls. Outbound calls have timeouts. There are no automated retries or open-relay recipient controls.

Origin validation and honeypots are not proof of humanity. The global quota deliberately limits a low-volume inbox; it can be exhausted by abuse. Shared Redis and actual provider/domain operation still require authorized integration verification.

## Actual validation results

| Executed check                             | Result                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run test:unit`                        | PASS — 28 tests, 0 failures                                                                                                          |
| `npm test`                                 | PASS — 22 desktop/mobile tests, 2.4 minutes                                                                                          |
| Targeted configured-document browser tests | PASS — 2 additional tests, 16.3 seconds including setup                                                                              |
| `npm run typecheck`                        | PASS — exit 0 after final test additions                                                                                             |
| `npm run lint`                             | PASS — exit 0, no errors or warnings                                                                                                 |
| `npm run validate:content`                 | PASS — six MDX entries plus social and asset configuration validation                                                                |
| `npm run test:mdx`                         | PASS — math, code, custom-component compilation                                                                                      |
| `npm run build`                            | PASS — 19 static-generation outputs; `/api/contact` remains dynamic                                                                  |
| Axe checks                                 | PASS — existing route scans plus Contact in both themes; no violations in the tested rule sets                                       |
| Responsive layout                          | PASS — existing desktop/mobile viewports plus 320px and 768px overflow checks for Home, About, Contact                               |
| Visual inspection                          | Completed — 1440px desktop and 390px mobile captures, dark/light contact, resume disclosure, Home/About, and icon concept comparison |

The 24 browser checks passed across the full 22-test run and the subsequent two configured-document checks. The latest Playwright HTML report contains the targeted run; this report preserves the complete result. The existing twelve Milestone 1 checks all passed again.

Tests exercise invalid/missing input, bounds, malformed JSON, declared/streamed payload caps, origin rejection, bots, missing live configuration, HTML escaping, recipient/sender injection rejection, correct Reply-To, successful mocked provider acknowledgement, failed/invalid/throwing provider responses, rate windows and aggregate limits, shared-limiter failure, and server timeout configuration. No actual email or real Redis database was used.

Asset tests cover all five configured link types, missing/unsafe URLs, labels/security attributes, missing/invalid PDFs, download names, navigation, nonexistent-image fallbacks, optimized image markup, icon raster sizes, and metadata endpoints. Synthetic swatches and PDF transport fixtures exist only in isolated tests and are never published as personal assets. Temporary fixture files were cleaned up; `public/images` and `public/documents` remain free of invented personal media.

One initial TypeScript error was found in a test-case header union and corrected by explicitly typing the cases. The production implementation's first build passed. No remaining test failure is known.

## Files changed

### New implementation files

- `src/lib/assets.ts`, `asset-files.ts`.
- `src/lib/contact/schema.ts`, `config.ts`, `handler.ts`, `rate-limit.ts`, `transport.ts`.
- `src/components/social-links.tsx`, `document-selector.tsx`, `resume-menu.tsx`, `photograph.tsx`, `brand-mark.tsx`, `contact-form.tsx`.
- `src/app/contact/page.tsx`, `src/app/api/contact/route.ts`, `src/app/favicon.ico`.
- `public/favicon-16.png`, `favicon-32.png`, `favicon-64.png`, `apple-icon.png`.
- `scripts/generate-identity.mjs`, `capture-m2.mjs`.
- `tests/unit/assets.test.tsx`, `tests/unit/contact.test.tsx`, `tests/milestone-2.spec.ts`.
- `docs/identity-concepts/concept-1.svg`, `concept-2.svg`, `concept-3.svg`.
- `docs/IDENTITY-ASSETS.md`, `RESUME-LIBRARY.md`, `CONTACT-INTEGRATION.md`, this report.

### Updated existing files

- `src/lib/profile.ts` — typed professional profiles.
- `src/components/header.tsx`, `contact.tsx` — document/brand/social integration.
- `src/app/layout.tsx`, `page.tsx`, `about/page.tsx`, `globals.css`, `sitemap.ts`, `icon.svg` — integrated features and styling.
- `scripts/validate-content.ts` — asset/profile integrity checks.
- `playwright.config.ts` — explicit mock-only isolated test server and separate browser test matching.
- `package.json`, `package-lock.json` — unit and icon-generation scripts; explicit Sharp development dependency.
- `.env.example`, `README.md`, `docs/ARCHITECTURE.md`, `CONTENT-AUTHORING.md`, `DEPLOYMENT.md` — updated configuration guidance.
- `src/components/reveal.tsx` — formatter-only change, no motion behavior change.

Ignored local review evidence lives in `artifacts/m2-*.png` and `artifacts/identity-concepts.png`. The local preview server was stopped after visual review.

## Remaining configuration dependencies

1. Supply verified profile URLs; no usernames were guessed.
2. Supply authentic PDF resumes/CV and photographs; no personal assets were fabricated.
3. Authorize and configure Resend, its verified sending subdomain, destination inbox, and shared Redis credentials/HMAC secret.
4. Complete domain verification with the exact SPF/DKIM and applicable TXT/MX/CNAME records supplied by Resend; review DMARC. No DNS changes have been made.
5. Explicitly authorize any eventual deployment and a controlled real-email acceptance/delivery test.

For setup see [Identity assets](IDENTITY-ASSETS.md), [Resume library](RESUME-LIBRARY.md), and [Contact integration](CONTACT-INTEGRATION.md). Existing research evidence and writing-content gaps from Milestone 1 remain documented separately.

## Known verification limits

No real sender-domain ownership, Redis service, provider account, inbox delivery, production TLS/DNS, or hosting deployment was tested. PDF content/accessibility and authentic photo composition cannot be reviewed until supplied. Tests use Chrome/Chromium mobile emulation, not physical devices or a full screen-reader audit. Lighthouse and live-user performance were not measured in this milestone. A provider acknowledgement is not a delivery webhook; ambiguous failures can require manual investigation before retrying.
