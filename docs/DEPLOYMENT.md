# Deployment guide — Vercel

Deployment is not authorized by the implementation brief and has not been performed. No Git remote or DNS has been changed.

1. Review content and run all checks documented in README. Commit the reviewed source and lockfile to a repository you control; exclude local caches, browsers, build output, and secrets. Push only after authorization.
2. In Vercel, import that GitHub repository, choose the Next.js framework preset, use the repository root, install with `npm ci`, and build with `npm run build`. Use a compatible Node.js 24 runtime. No environment variables are required.
3. Review the protected preview deployment on mobile and desktop. Verify all routes, social cards, fonts, 404s, and contact links before production.
4. After explicit approval, add `sakshamkumarmishra.cv` in the project's domain settings. At the DNS provider, use the exact current record values shown by Vercel for that project. An apex normally uses an A record and subdomains use CNAME records; do not copy historical hardcoded IP values from a tutorial. Preserve unrelated MX/TXT records.
5. Add `www.sakshamkumarmishra.cv` if desired and configure a permanent redirect to the non-www canonical domain. Verify HTTPS certificate issuance, HTTP-to-HTTPS behavior, and redirect loops after DNS propagates. Canonical metadata already targets the non-www HTTPS origin.
6. Check `/sitemap.xml`, `/robots.txt`, and `/opengraph-image`. Pending case studies are excluded from sitemap and use noindex; update their status only after verification. Preview privacy is a Vercel project setting, not guaranteed by canonical tags.

For rollback, redeploy/promote the previously reviewed Vercel deployment. Content changes are source changes and trigger a new build.

Current authoritative guidance: https://vercel.com/docs/domains/working-with-domains/add-a-domain and https://nextjs.org/docs/app/getting-started/installation (consulted during implementation). Domain-specific DNS instructions in the Vercel project take precedence over generic examples.
