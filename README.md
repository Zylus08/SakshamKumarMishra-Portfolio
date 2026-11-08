# SKM — A Digital Research Atelier

A local Next.js portfolio for Saksham Kumar Mishra, targeting `https://sakshamkumarmishra.cv`. No deployment, DNS changes, remote pushes, or external accounts are part of this delivery.

## Run locally

Use Node.js 24 LTS and npm. No environment secrets are required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview, use `npm run build` then `npm start`.

```sh
npm run validate:content
npm run test:mdx
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
```

On machines with a full system drive, install with `npm ci --cache .npm-cache` and set `TEMP`, `TMP`, and `PLAYWRIGHT_BROWSERS_PATH` to writable workspace subdirectories. These local artifacts are ignored.

## Implemented

- Five primary pages and six MDX research/project detail pages.
- Six-act homepage with original SVG signal study, GSAP scroll reveals, architectural artwork, and editorial project layouts.
- Dark-first persistent theme, responsive navigation, keyboard command palette, category/search/status filters, and project list/grid view.
- Validated MDX, mathematics, code blocks, technical notes, diagrams, benchmark tables, reading time, and section navigation.
- Metadata, canonical URLs, social image, sitemap, robots, SVG icon, 404, structured data, and security response headers.
- Playwright coverage for routes, accessibility, responsive overflow, palette, filters, themes, and reduced motion.

## Content integrity

The brief provides identity and candidate project topics, not source repositories or evidence. All six case studies explicitly show **Verification pending**. No results, publication status, dates, affiliations, or benchmarks have been invented. Contact links and CV appear automatically once verified values are added in `src/lib/profile.ts`. The writing archive is deliberately empty.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Content authoring](docs/CONTENT-AUTHORING.md)
- [Verification checklist](docs/CONTENT-VERIFICATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Testing and milestone report](docs/TESTING.md)

The production build uses Webpack because the initial Turbopack run stalled on this Windows host. For the installed Chrome browser, set `PLAYWRIGHT_CHANNEL=chrome`; otherwise install the Playwright Chromium build as shown above.

Before public launch, complete the content verification checklist. The application can be reviewed locally without those personal assets.
