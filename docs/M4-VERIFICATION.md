# Milestone 4 verification

Date: 2026-11-10. Local workspace: `E:\SakshamKumarMishra Portfolio`.

## Results

| Check | Actual outcome |
|---|---|
| TypeScript | Passed |
| ESLint | Passed |
| Content validation | Passed: all 29 entries |
| MDX validation | Passed: all 29 entries, including math/code/diagram and unsafe-JavaScript checks |
| Unit tests | Passed: 50 tests, zero failures or skips (4.42 seconds) |
| Production build | Passed: 42 pages generated |
| Full desktop/mobile browser suite | Passed: all 110 tests (55 desktop, 55 mobile), 7.0 minutes, exit code 0 |
| PDF integrity | All four SHA-256 hashes match the original assets; three corrected resumes unchanged |
| PDF inspection | Supplied Academic CV parsed and all four pages rendered and visually inspected |
| Diff whitespace | `git diff --check` passed; only Windows line-ending notices |

Local logs are retained in ignored `.tmp/m4-static.log`, `.tmp/m4-build.log`, and `.tmp/m4-browser.log`. Browser execution is bounded and uses an owned local server, explicit mock transport, and blank provider/Redis credentials. Production transport tests inject mocked network responses. No live email was sent.

The first browser attempt was interrupted without a final result. Its artifacts recorded a closed browser target, a crashed target and a gallery timeout. No surviving runner or Playwright process remained when inspected. A fresh full run with incremental log output passed all 110 tests; the initial attempt is not counted as a pass. No application assertions were weakened to accommodate it. Historical M3.1 screenshot artifacts were restored after the run.

Targeted unit coverage exercises production-shaped Redis-to-Resend delivery, missing/malformed configuration, invalid sender fields, provider rejection, invalid acknowledgements, network errors, safe logging, canonical origins, preview/test isolation and limiter denial/failure. Existing validation, honeypot, payload-size and shared-limiter tests remain in the suite. Browser additions verify all four actual PDF responses, MIME types, download names and bytes, Research/menu access, and honest unavailable/network-error feedback. The existing suite covers navigation, professional links, contact validation, accessibility and responsive layouts.

## Changes

- Contact: `src/lib/contact/config.ts`, `handler.ts`, `transport.ts`, new `diagnostics.ts`, and `src/app/api/contact/route.ts`. Adds canonical www origin, non-production sending guard, fail-closed readiness checks, safe request correlation and provider diagnostics, and the portfolio inquiry subject prefix. Existing validation and shared production limiter remain.
- Documents: `src/lib/assets.ts`, `src/app/[collection]/page.tsx`, and authentic `public/documents/Saksham_Mishra_CV.pdf`. Existing About cards and menu consume the shared library automatically; Research gains a contextual download link.
- Configuration/documentation: `.env.example`, `docs/CONTACT-INTEGRATION.md`, `docs/RESUME-LIBRARY.md`, and the four M4 reports. `.env.local` and unrelated settings are unchanged.
- Tests: `tests/milestone-2.spec.ts`, `tests/milestone-2-2.spec.ts`, `tests/unit/assets.test.tsx`, new `tests/milestone-4.spec.ts`, `tests/unit/m4-contact.test.tsx`, `tests/unit/m4-documents.test.tsx`, and `tests/fixtures/document-integrity.json`.

The five-tab navigation, photographs, 24-project catalogue, research articles and three corrected resume PDFs are unchanged. No credentials were added to tracked files.

## Production evidence and remaining work

Read-only production checks at 17:42:05 UTC observed the apex redirecting to www and the canonical contact GET returning HTTP 200 with `{"mode":"disabled"}`. No production POST was made. Remote environment values, domain verification, provider events and inbox arrival have not been verified. The exact remote missing setting cannot be determined from the public endpoint alone.

The owner must configure the verified sending subdomain, scoped Resend key and shared Redis settings, then authorize deployment. One live submission requires separate explicit authorization after deployment; provider acknowledgement and inbox arrival must be checked independently. Follow [the deployment guide](M4-EMAIL-DEPLOYMENT-GUIDE.md). No push, deployment or DNS change was performed.

| Requested status | Current evidence |
|---|---|
| Implemented locally | Yes: contact hardening and authentic Academic CV integration |
| Unit-verified | Yes: all 50 unit tests passed |
| Production-configured | Not performed or verified; public endpoint reports disabled |
| Deployed | No: this milestone remains local |
| Provider-accepted | Not live-verified; mocked acceptance tested only |
| Inbox-confirmed | No live test sent or inbox confirmation obtained |

## Reports

- [Contact root cause](M4-CONTACT-ROOT-CAUSE.md)
- [Email deployment guide](M4-EMAIL-DEPLOYMENT-GUIDE.md)
- [Academic CV identity and integrity](M4-RESEARCH-CV-INTEGRATION.md)
