# Architecture

## Repository reconnaissance

The provided workspace was empty, with no Git repository, framework, reusable assets, or local AGENTS.md. Implementation was initialized in place. No existing work was replaced.

## Rendering and routes

Next.js App Router renders the site shell and content on the server. `/`, `/about`, `/contact`, `/[collection]`, and `/[collection]/[slug]` cover the public routes. The collection parameter is allowlisted to research, projects, and writing; unknown collections and slugs return 404. Static params pre-render all supplied content. Shared templates keep new entries independent of page implementation.

`src/lib/content.ts` loads repository-owned MDX through gray-matter and validates frontmatter with Zod. It supplies only the metadata needed by interactive explorers; MDX bodies remain on the server. MDX is trusted executable content: never accept untrusted uploads or user-authored MDX through an endpoint.

`src/lib/profile.ts` contains identity, verified-link slots, timeline, navigation, and canonical origin. `src/content/` holds research, projects, and writing. Authoring additions are picked up at build time.

## Client boundaries

- Header: navigation, native modal dialog command palette, theme persistence, Motion mobile-menu transition.
- Explorer: search, filters, list/grid display.
- Field: lightweight deterministic SVG visualization with a touch/keyboard button.
- Reveal: lazy-imported GSAP and ScrollTrigger, scoped cleanup, no scroll hijacking. Content remains visible without animation or JavaScript.

No WebGL or Three.js is needed for the visualization. Milestone 2 adds a Node Route Handler at `/api/contact`, a shared client/server validation schema, and server-side Resend/Redis adapters. Live email requires secrets and shared Redis counters; mock mode needs neither. No message database, authentication, analytics, or third-party tracking is introduced. See CONTACT-INTEGRATION.md for modes, rate limits, and trust boundaries.

Asset metadata lives in `src/lib/assets.ts`; filesystem checks run on the server and pass only available document metadata to the client header. `Photograph` is a server component using Next Image. Social profile configuration remains public and separate from server environment secrets.

## Operational notes

Fonts are packaged locally through Fontsource; the build does not fetch Google Fonts. The canonical origin is centralized. Verification-pending detail pages are noindex and omitted from the sitemap. Changes to content require a rebuild. Static assets can use the Vercel CDN; the application uses the ordinary Next.js preset.
