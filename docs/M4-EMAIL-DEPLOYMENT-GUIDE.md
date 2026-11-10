# M4 email production setup

Prepared 2026-11-10. This is a setup and verification guide, not a record of deployed changes. Never paste API-key values into Git, logs or chat.

## 1. Verify the sending subdomain

Use a dedicated portfolio sending subdomain, for example `updates.sakshamkumarmishra.cv`. This name is a proposal, **not a currently verified domain**. Add the exact subdomain to Resend and copy its generated DNS records from the account dashboard. Resend requires verification of the sending domain and supports separate subdomains. [Resend verified domains](https://resend.com/docs/dashboard/domains/introduction)

Record the dashboard-provided type, host/name, value, TTL and any MX priority for every required DKIM and SPF/return-path record. Values are account/region-specific and cannot be supplied from this repository. Do not guess them, replace unrelated website/inbound-mail records, or create conflicting SPF records at an existing hostname. Have the owner review and authorize the exact DNS changes before applying them. Wait for Resend to show the selected domain as verified.

After verification, a proposed From address is `contact@updates.sakshamkumarmishra.cv`. Use the actual verified subdomain if different. The application requires a plain email address on a subdomain of `sakshamkumarmishra.cv`; it rejects Gmail and the bare apex as senders. Resend does not require creating a separate mailbox for each From local-part on its verified domain. [Resend sending identity](https://resend.com/docs/dashboard/emails/introduction)

## 2. Provision credentials privately

Create a Resend key with **sending access**, restricted to the chosen verified domain where supported. Store it directly in Vercel's server-side environment settings. Full account-management access is unnecessary for this application's send endpoint. Keep dashboard/admin access separate for later delivery-event inspection. [Resend key permissions](https://resend.com/docs/api-reference/api-keys/create-api-key)

Provision shared Upstash Redis. Obtain its HTTPS REST root URL and token with permission for the application's atomic `EVAL`, `GET`, `INCR`, `TTL`, and `EXPIRE` operations. A read-only token will not work. Generate a stable cryptographically random limiter secret of at least 32 characters; every production instance must use the same value. The limiter must remain shared, not replaced by local memory. [Upstash REST API](https://upstash.com/docs/redis/features/restapi)

## 3. Set Vercel Production variables

Use these exact names, scoped to **Production**. Never use a `NEXT_PUBLIC_` prefix.

| Variable | Production value |
|---|---|
| `CONTACT_TRANSPORT` | `resend`, only for the authorized live release |
| `CONTACT_TO_EMAIL` | `mishrasaksham080705@gmail.com` |
| `CONTACT_FROM_EMAIL` | Actual verified subdomain address; proposed `contact@updates.sakshamkumarmishra.cv` |
| `RESEND_API_KEY` | Set privately: domain-scoped sending key |
| `UPSTASH_REDIS_REST_URL` | Actual HTTPS REST root endpoint, no credentials/query/path suffix |
| `UPSTASH_REDIS_REST_TOKEN` | Set privately: required Redis permissions |
| `CONTACT_RATE_LIMIT_SECRET` | Set privately: stable random value, at least 32 characters |
| `CONTACT_ALLOWED_ORIGINS` | Optional exact trusted origins; apex and `https://www.sakshamkumarmishra.cv` are built in |

Do not carry localhost origins into production. Keep Preview/Development at `CONTACT_TRANSPORT=mock` without production credentials. The code refuses Resend when `NODE_ENV` is development/test or `VERCEL_ENV` is preview/development. Do not spoof those platform environment labels to bypass the guard. Automated browser tests explicitly use mock transport and blank service credentials.

Vercel environment changes apply to new deployments. Once the values are configured and this local patch is reviewed, obtain explicit deployment authorization and redeploy. The current production endpoint will not gain these changes merely because local files or dashboard variables changed. [Vercel environment configuration](https://vercel.com/docs/environment-variables)

## 4. Pre-send check and diagnostics

Read `GET https://www.sakshamkumarmishra.cv/api/contact`. After the authorized release it should return `{"mode":"live"}` with no-store caching. This only checks transport/environment/configuration shape; it does not authenticate the key, verify DNS, query Redis, or send an email.

In Vercel function logs, use the `contact` component and request ID:

| Event | Meaning / next check |
|---|---|
| `disabled` | Missing/unrecognized transport or non-production live-mode guard. |
| `configuration_error` | Check listed missing/invalid setting names; values are deliberately omitted. |
| `limiter_error` | Redis URL/token/permissions/reachability; sending was denied. |
| `rate_limited` | Wait for Retry-After; do not retry repeatedly. |
| `provider_rejected` | Check HTTP status and Resend dashboard: domain, key scope, account limits. |
| `provider_network` / `provider_invalid_ack` | Acceptance unconfirmed; inspect logs before deciding whether to retry. |
| `provider_accepted` | Provider returned an ID; inspect its delivery event separately. |

The subject identifies the inquiry, the recipient is fixed, and the submitter's validated address is used only as `reply_to`. Provider acceptance is not inbox confirmation. [Resend send API](https://resend.com/docs/api-reference/emails/send-email)

## 5. Exactly one authorized live verification

After credentials and deployment are ready, request explicit authorization for **one** test submission. Do not run this from automated tests, rate-limit probes, or retries.

1. Open the canonical production contact form. Use a controlled Reply-To address and a unique, non-sensitive subject such as `M4 delivery verification — <UTC timestamp>`.
2. Submit once. Record the API status/code and `X-Contact-Request-Id`. Expect 202/accepted only if the provider acknowledged the message. The form must say acceptance, not confirmed inbox delivery.
3. Correlate the request with the provider UUID in function logs and inspect that message's Resend event status. Record accepted, delivered, delayed, bounced or rejected exactly as observed. A receiving server's delivery acknowledgement is distinct from inbox placement.
4. Check `mishrasaksham080705@gmail.com` for that exact subject/timestamp. Confirm Inbox placement, sender, Reply-To and body. If it appears only in Spam, report that distinction. If absent, leave inbox confirmation pending; do not send another test automatically.
5. Confirm the production Academic CV URL returns a PDF, and compare its bytes/hash with the integration report. This read-only download does not require another email.
6. Update the verification matrix with actual evidence and timestamps. Never mark provider acceptance or inbox confirmation from mocked tests.

The submit button prevents concurrent clicks but there is no durable retry/deduplication store. A browser timeout can be ambiguous after provider acceptance. Inspect the existing request before any separately authorized retry.

## 6. Safe rollback

Set Production `CONTACT_TRANSPORT=disabled` and perform an explicitly authorized redeployment; the existing mailto fallback remains usable. If immediate suspension is necessary, the owner can revoke the sending key in Resend while preparing that release. Do not blindly roll back to an older deployment with unknown live credentials. Restore a reviewed configuration only after diagnosing the failure. Preserve unrelated DNS and all document assets throughout rollback.
