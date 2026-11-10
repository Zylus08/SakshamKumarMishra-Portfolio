# Contact integration

## Architecture and modes

`ContactForm` is reused on the homepage and `/contact`. Contact remains outside the five primary tabs, but is reachable through the footer and command palette. `POST /api/contact` validates and sends; `GET /api/contact` returns only public availability with `no-store` caching. Incomplete live configuration reports disabled; this check does not contact or validate provider services. Server credentials never appear in that response or client imports. Current diagnosis and setup: [M4 root cause](M4-CONTACT-ROOT-CAUSE.md), [M4 deployment guide](M4-EMAIL-DEPLOYMENT-GUIDE.md).

The Route Handler uses server-only Node modules under `src/lib/contact/`. Only the shared input schema is imported by the client. Resend is called through its HTTPS REST endpoint, avoiding an unnecessary SDK dependency.

- `CONTACT_TRANSPORT=mock`: validation and a bounded local rate limiter run, but no provider or Redis network call is made. The visible result explicitly says **No email was sent**. This mode works under `next start` for integration testing.
- `CONTACT_TRANSPORT=resend`: live sending is requested, and complete configuration is mandatory. The handler fails closed on missing settings or shared-limiter failure.
- Development, tests and Vercel previews cannot use Resend: requesting live transport there returns disabled. With no selected transport these environments default to mock. Production defaults to disabled with HTTP 503 for submissions. There is no automatic live-send mode triggered by credentials alone.

The UI separates idle, validating, submitting, provider-accepted, mock, rate-limited, and failed states. HTTP 202 means the provider returned an ID; it does **not** prove inbox delivery. Network failures and ambiguous responses never display success. Message content is not persisted locally, echoed in responses, or logged.

## Local configuration

Copy `.env.example` to `.env.local`. The checked-in example has blank secrets, explicit mock mode, and the user-supplied recipient `mishrasaksham080705@gmail.com`. This Gmail address is the destination and public mailto fallback, never the Resend sender. The local-only `.env.local` sets the same recipient and mock mode. For testing with installed Chrome on this Windows host, set `PLAYWRIGHT_CHANNEL=chrome`, and use workspace `.tmp` for TEMP/TMP if the system drive remains full. Playwright starts its own server with mock mode and blank provider credentials, and refuses to reuse an existing server. Automated tests never send emails.

## Live configuration, only after authorization

| Variable                    | Purpose                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| `CONTACT_TRANSPORT`         | Set to `resend` only when live sending is authorized                       |
| `RESEND_API_KEY`            | Server-only sending key for the verified domain                            |
| `CONTACT_TO_EMAIL`          | One fixed destination mailbox, plain email address                         |
| `CONTACT_FROM_EMAIL`        | One plain email address on a verified subdomain of `sakshamkumarmishra.cv` |
| `UPSTASH_REDIS_REST_URL`    | HTTPS REST endpoint of a shared Redis database                             |
| `UPSTASH_REDIS_REST_TOKEN`  | Server-only token with EVAL/read/write/expiry permission                   |
| `CONTACT_RATE_LIMIT_SECRET` | At least 32 random characters; stable across instances                     |
| `CONTACT_ALLOWED_ORIGINS`   | Optional comma-separated exact origins for explicitly approved previews    |

Both apex and `www` HTTPS portfolio origins are always allowed. Development also allows localhost and 127.0.0.1 on port 3000. Do not configure wildcard or untrusted origins. Keep secrets in local untracked environment files or hosting environment settings; never prefix them with `NEXT_PUBLIC_`. A sending address such as a mailbox on `updates.sakshamkumarmishra.cv` is a configuration choice, not an assertion that such a mailbox/domain is currently verified.

## Domain and DNS setup

No DNS changes were performed. After authorization, add the chosen sending subdomain in Resend, select its region, and copy the generated records exactly to the authoritative DNS provider. Resend's required SPF/DKIM records may include TXT, MX, or CNAME depending on configuration. Keep relevant CNAME records DNS-only; preserve existing root-domain website and mailbox records. Wait for the Resend dashboard to report verification. Review DMARC for the sending domain after SPF/DKIM verification, with a policy appropriate to existing mail streams. Do not replace unrelated inbound MX records or blindly add a second SPF record at the same hostname. [Resend domain setup](https://resend.com/docs/add-a-domain)

Using a separately verified sending subdomain helps separate its reputation from other email uses. This implementation deliberately requires a subdomain for its fixed From address. [Resend subdomain guidance](https://resend.com/docs/dashboard/domains/introduction)

The recipient is fixed by configuration. The visitor's validated address is used only for `reply_to`; the visitor is never impersonated as From. Provider requests include text and escaped HTML, subject, visitor details, and a UTC timestamp. [Resend send API](https://resend.com/docs/api-reference/emails/send-email)

## Anti-abuse controls

- JSON-only POST; exact Origin allowlist; cross-site Fetch Metadata rejection. Requests lacking Origin are rejected. The endpoint has no authenticated session or cookies.
- A 16 KiB body cap applies to declared and streamed bytes before JSON parsing.
- Zod strict schema: email <=254 characters, subject 3–160, message 20–5,000, optional name <=80, honeypot <=200. Header/control characters are rejected. Unknown keys such as `from`, `to`, `html`, and `reply_to` are rejected.
- Filled honeypots return rejection, never fake success.
- Text is kept literal; HTML escapes ampersands, angle brackets, quotes, and apostrophes. No user HTML is rendered or executed.
- Live mode uses an atomic Redis EVAL across keys, with a one-hour fixed window from the first attempt: 30 global attempts, 3 per email, and 5 per trusted Vercel client IP. Limits count attempts before sending, including provider failures. Keys expire after one hour. No message body is stored in Redis.
- Email/IP keys use HMAC-SHA256 with the server secret. Only the Vercel-overwritten forwarding header is trusted when `VERCEL=1`; arbitrary `X-Forwarded-For` is ignored. On other hosts, global and email limits still apply; adapt trusted ingress handling before relying on IP limits there. [Vercel header reference](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for)
- Redis failure denies sending with 503; live mode never falls back to instance memory. The development limiter is intentionally local and must not be used as production email protection. [Upstash REST API](https://upstash.com/docs/redis/features/restapi)
- Redis and Resend calls have bounded timeouts. The handler exposes only generic failures and a Retry-After value for limits. There are no full-message logs, automatic retries, attachments, recipient overrides, or outbound links generated from user HTML.

## Operational limits and launch verification

This is a low-volume portfolio inbox. A honeypot and rate limiter reduce abuse but cannot prove a submitter is human; the conservative global cap can itself be exhausted by an attacker. For sustained abuse, add platform WAF rules or a server-verified challenge. Origin validation prevents browser-based cross-origin submissions, not scripted clients that forge headers.

Redis is tested using transport mocks and algorithm tests, not a provisioned live database. Resend acceptance is tested with mocked HTTP responses. No live delivery, DNS verification, spam-folder behavior, or provider account configuration has been tested. Redis credentials and a verified sender are additional deployment dependencies.

For authorized production verification: follow the single-submission procedure in the M4 deployment guide. Preview deployments remain mock-only. Inspect Resend acceptance/delivery events and the intended Gmail inbox separately. Confirm Reply-To and form feedback. Never perform live sends as part of automated tests or send extra messages to test rate limits. A client timeout after provider acceptance may be ambiguous; there is no durable message store or delivery webhook in this milestone. Do not infer delivery or immediately auto-retry.

Structured server diagnostics contain fixed event names, generated request IDs, missing/invalid configuration field names, provider HTTP status and a validated provider UUID when available. They do not log message contents, visitor identity, IP addresses, raw provider errors, or credentials. Delivery-path responses include `X-Contact-Request-Id` for correlation. Logging failures do not alter an accepted delivery outcome.
