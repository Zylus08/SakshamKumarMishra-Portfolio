# M4 contact root cause

Reviewed 2026-11-10. No live submission or email was sent during diagnosis.

## Observed production state

Read-only HTTP checks returned:

| Request | Observation |
|---|---|
| `GET https://sakshamkumarmishra.cv/api/contact` | HTTP 308 to `https://www.sakshamkumarmishra.cv/api/contact`. |
| `GET https://www.sakshamkumarmishra.cv/api/contact` | HTTP 200, `Cache-Control: no-store`, body `{"mode":"disabled"}`; observed at 2026-11-10 17:42:05 UTC. |

**The deployed endpoint is disabled, not accepting messages for Resend delivery.** In the inspected baseline, production requires exactly `CONTACT_TRANSPORT=resend`; absent/unrecognized transport disables sending, while explicit `mock` validates without delivery. The observed disabled response is consistent with no recognized active transport, not with provider acceptance followed by a missing inbox message.

The deployed environment dashboard and provider account were not accessible through a configured Vercel/Resend connector, and this checkout has no `.vercel/project.json`. Exact remote variable values, domain verification, provider credentials and provider logs therefore remain unverified. Do not interpret local settings as proof of which remote variable is absent. No provider rejection or inbox-delivery failure was reproduced.

## Local configuration and code findings

The local `.env.local` explicitly selects mock and contains the destination inbox. The required Resend sender/key, shared Redis URL/token and limiter secret are missing or empty locally. Only configuration presence and the recognized transport label were inspected for reporting; credential values were not printed or changed. `.env.example` intentionally remains mock-only. No environment-variable naming mismatch was found in the checked-in implementation.

The baseline already implemented the Resend REST request, visitor `reply_to`, escaped HTML and plain text, provider error propagation, and HTTP 202 only after a nonempty provider ID. It did not claim inbox delivery. Live mode already required the shared atomic Redis limiter and failed closed rather than using instance memory. Honeypot, strict Zod validation, 16 KiB payload limits, origin checks, fixed recipient/sender configuration, and generic public errors were working and retained.

Two deployment-facing gaps were found:

1. The default origin list contained the apex domain, but production redirects to `www`. Unless `CONTACT_ALLOWED_ORIGINS` explicitly included `www`, a browser submission on the canonical site would fail origin validation. This is a source-confirmed default mismatch; no production POST was attempted to discover the remote allowlist.
2. Public GET status previously reported live whenever the transport string was `resend`, even if mandatory configuration was invalid. Generic failures had no non-sensitive server diagnostic trail. Configuration/readiness and provider failures were consequently difficult to distinguish operationally.

## Implemented locally

- Allow both exact HTTPS portfolio origins; continue rejecting lookalike domains, cross-site fetch metadata, missing origins and unapproved previews.
- Block live transport in development, test and Vercel preview/development contexts even if production credentials were copied. Explicit mock remains available for production-build browser tests; missing production transport stays disabled.
- Make GET readiness fail closed when live configuration is incomplete or malformed. No DNS or provider call occurs in the readiness check, so `live` means configuration-shaped readiness, not independently verified delivery.
- Reject empty/whitespace or CR/LF-containing provider credentials, invalid plain sender/recipient addresses, non-subdomain senders, insufficient HMAC secrets and malformed Redis endpoints before network access.
- Identify outgoing subjects as `[SKM Portfolio Inquiry] ...`; retain fixed From/To, validated visitor Reply-To, escaped HTML, plaintext and bounded requests.
- Add structured events for disabled/configuration/limiter/provider outcomes. Logs contain generated request IDs, missing/invalid setting names, provider HTTP status and validated provider UUIDs only. Delivery-path responses include `X-Contact-Request-Id`. No raw provider errors, visitor identity, message content, IP addresses or credential values are logged. Logging failure cannot convert accepted mail into an error response.

The contact form's existing honest accepted/mock/error states remain unchanged. The public mailto fallback remains available on both forms.

## What remains

Production is **not repaired by local edits alone**. The owner must verify a sending subdomain, provision the shared limiter, configure the exact production variables, and explicitly authorize deployment. One separately authorized live submission must then be checked at API, provider-event and Gmail-inbox levels. Mocks do not establish live acceptance or delivery. See [deployment guide](M4-EMAIL-DEPLOYMENT-GUIDE.md) and [verification](M4-VERIFICATION.md).
