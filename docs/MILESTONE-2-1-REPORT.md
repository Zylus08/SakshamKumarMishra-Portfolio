# Milestone 2.1 — Verified profiles and contact inbox

Date: 8 November 2026 (Asia/Calcutta).

## Integrated configuration

The single existing typed `profile.socials` configuration now contains exactly:

| Platform | Supplied URL                                   |
| -------- | ---------------------------------------------- |
| GitHub   | https://github.com/Zylus08                     |
| LinkedIn | https://www.linkedin.com/in/saksham-mishra-ml/ |
| LeetCode | https://leetcode.com/u/zylus08/                |
| CSES     | https://cses.fi/user/515838                    |

Codeforces remains an empty string and is omitted everywhere, including the command palette. No old/disabled account or invented URL was added. These are user-supplied profile identities; remote account ownership or availability was not independently asserted.

The public email and intended `CONTACT_TO_EMAIL` are `mishrasaksham080705@gmail.com`. `.env.example` records this non-secret recipient and preserves explicit mock mode. There was no `.env.local`; a Git-ignored local file was created with the recipient and mock mode. No existing secret was read, printed, or overwritten. `CONTACT_FROM_EMAIL` remains blank in the example. Gmail is not used as a Resend sender; a separately verified permitted subdomain address is still required for live sending.

## UX and preservation

The existing SocialLinks component and command palette consume the same profile configuration. Home, About, Contact, and all footers now show four profiles with safe external-link attributes. The shared form displays the visible `mailto:mishrasaksham080705@gmail.com` fallback on Home and Contact. The shared contact block retains its internal `/contact` link and also shows the email, so direct email availability does not remove contact-page discovery.

Mock submissions continue to say that no email was sent. Five primary navigation tabs remain unchanged. No layout system, resume/photo components, validation, provider adapter, or rate-limit algorithm was redesigned.

## Actual test results

| Check                                   | Result                                                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Complete unit suite, sequential retry   | PASS — 30 tests, zero failures                                                                                         |
| Content/configuration validation        | PASS — six MDX entries and profile/asset checks                                                                        |
| MDX compilation tests                   | PASS — math, code, and custom components                                                                               |
| Final TypeScript check                  | PASS — exit 0                                                                                                          |
| Final ESLint check                      | PASS — exit 0, no warnings/errors                                                                                      |
| Production build, local two-worker mode | PASS — 19 static outputs; contact API remains dynamic                                                                  |
| Full desktop/mobile Playwright suite    | PASS — 28 tests in 1.2 minutes, including existing accessibility, navigation, contact, and rate-limit-related coverage |

The four social URLs were checked in every supported group on Home, About, Contact, and the footer. Command-palette selection was exercised against intercepted external navigation, asserting exact URLs without visiting or contacting the external profiles. Codeforces was absent from links and palette results. Both forms exposed the correct mailto fallback and advertised mock mode. The five primary tabs remained unchanged. Security unit tests reconfirmed validation, rate limiting, recipient/sender restrictions, and zero mock transport network calls. All provider acknowledgements in tests were mocked.

The isolated Playwright server stopped automatically after testing. No unresolved test failures remain. Initial resource failures and the temporary approval/port obstacles are recorded below rather than counted as passes.

## Resource-related verification notes

Initial unit/lint/build attempts encountered host out-of-memory failures. The complete unit suite was rerun sequentially using `node node_modules/tsx/dist/cli.mjs --test --test-concurrency=1 tests/unit/*.test.tsx` with `GOMAXPROCS=2`. Lint and TypeScript were run sequentially. A later build reached static generation but exhausted memory with fourteen workers. `next.config.ts` now supports opt-in `SKM_LOW_MEMORY_BUILD=1`, set only in the local ignored environment file, to use two build workers. Default deployment build settings remain unchanged.

## Files changed

- `src/lib/profile.ts` — exact profiles and public email.
- `src/components/contact-form.tsx` — visible email fallback beside both forms.
- `src/components/contact.tsx` — preserve contact-page navigation while exposing direct email.
- `.env.example` — intended non-secret recipient; mock preserved and sender blank.
- `.env.local` — new local-only mock/recipient configuration and low-memory build opt-in.
- `next.config.ts` — optional local worker cap to complete verification on this host.
- `playwright.config.ts` — optional isolated test port; mock mode and refusal to reuse an existing server are preserved.
- `tests/unit/profile-config.test.tsx` — exact values, recipient/sender separation, navigation, zero mock network calls.
- `tests/milestone-2-1.spec.ts` — all supported link locations, command navigation, hidden Codeforces, and mailto fallbacks.
- `tests/milestone-2.spec.ts` — replace the obsolete unconfigured-social assertion with four configured profiles per group.
- `README.md`, `docs/IDENTITY-ASSETS.md`, `docs/CONTACT-INTEGRATION.md`, `docs/CONTENT-VERIFICATION.md`, this report — current configuration and handoff.

## Browser execution environment

The initial browser launch was not executed because automatic approval review hit a usage limit. After the user requested continuation, approval succeeded, but port 3000 was already occupied. The existing server was left untouched. Browser verification uses `SKM_TEST_PORT=3100`; the test server origin allowlist follows that port, and provider credentials remain blank with explicit mock mode.

## Remaining dependencies

The portfolio is ready for the photography and resume integration milestone: provide authentic portrait/lifestyle files and the actual resume/CV PDFs for the already implemented configuration slots. Codeforces remains optional until a valid new profile is supplied. Live email still requires explicit authorization, a verified sending-subdomain address, Resend credentials, shared Redis settings, and a stable rate-limit secret. No real email, push, deployment, or DNS change occurred.
