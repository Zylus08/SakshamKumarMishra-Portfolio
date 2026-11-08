# SKM — A Digital Research Atelier

A local Next.js portfolio for Saksham Kumar Mishra, targeting `https://sakshamkumarmishra.cv`. No deployment, DNS changes, remote pushes, or external accounts are part of this delivery.

## Run locally

Use Node.js 24 LTS and npm. Development defaults to a clearly labeled mock contact transport; no secrets are needed for local review. Live email requires the configuration in [Contact integration](docs/CONTACT-INTEGRATION.md).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview, use `npm run build` then `npm start`.

```sh
npm run validate:content
npm run test:mdx
npm run test:unit
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
```

On machines with a full system drive, install with `npm ci --cache .npm-cache` and set `TEMP`, `TMP`, and `PLAYWRIGHT_BROWSERS_PATH` to writable workspace subdirectories. These local artifacts are ignored.

## Implemented

- Five primary pages and six MDX research/project detail pages.
- Six-act homepage with original SVG signal study, GSAP scroll reveals, authentic-photo slots with editorial fallbacks, and project layouts.
- Dark-first persistent theme, responsive navigation, keyboard command palette, category/search/status filters, and project list/grid view.
- Validated MDX, mathematics, code blocks, technical notes, diagrams, benchmark tables, reading time, and section navigation.
- Metadata, canonical URLs, social image, sitemap, robots, SVG icon, 404, structured data, and security response headers.
- Typed professional links for GitHub, LinkedIn, Codeforces, LeetCode, and CSES.
- Navbar/About resume library, validated local PDFs, original SKM favicon family, and responsive Next Image photography.
- Homepage and dedicated contact forms, Resend-ready server handler, explicit mock adapter, strict validation, and shared serverless rate limiting.
- Unit and Playwright coverage for routes, accessibility, responsive overflow, palette, filters, themes, assets, and contact security.

## Content integrity

The brief provides identity and candidate project topics, not source repositories or evidence. All six case studies explicitly show **Verification pending**. No results, publication status, dates, affiliations, or benchmarks have been invented. Professional URLs belong in `profile.socials` in `src/lib/profile.ts`; PDF/photo metadata belongs in `src/lib/assets.ts`. Unconfigured profiles are hidden and asset slots have honest empty states. The writing archive is deliberately empty.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Content authoring](docs/CONTENT-AUTHORING.md)
- [Verification checklist](docs/CONTENT-VERIFICATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Milestone 1 testing history](docs/TESTING.md)
- [Identity and photography](docs/IDENTITY-ASSETS.md)
- [Resume library](docs/RESUME-LIBRARY.md)
- [Contact integration and security](docs/CONTACT-INTEGRATION.md)
- [Milestone 2 report](docs/MILESTONE-2-REPORT.md)
- [Milestone 2.1 profile/inbox integration](docs/MILESTONE-2-1-REPORT.md)

The production build uses Webpack because the initial Turbopack run stalled on this Windows host. For the installed Chrome browser, set `PLAYWRIGHT_CHANNEL=chrome`; otherwise install the Playwright Chromium build as shown above.

Before public launch, complete the content verification checklist. The application can be reviewed locally without those personal assets.

For a constrained local host, set `SKM_LOW_MEMORY_BUILD=1` to cap build workers at two. If port 3000 is occupied, set `SKM_TEST_PORT=3100` for an isolated Playwright server; tests continue to force mock email delivery and never reuse an existing server.
