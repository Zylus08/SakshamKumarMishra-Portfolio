# Content authoring

Add a kebab-case `.mdx` file to `src/content/research`, `src/content/projects`, or `src/content/writing`. The filename is the route slug. Files are validated during build; invalid frontmatter fails clearly.

```mdx
---
title: "A verified title"
summary: "A concise, factual description."
category: "Engineering"
status: Draft
featured: false
tags: ["Systems"]
date: "2026-11-08"
---

## The question

Write the article here. Math is supported: $y = f(x)$.

<Note>State assumptions and limitations explicitly.</Note>

<Diagram
  steps={["Input", "Transform", "Output"]}
  caption="Explain what the diagram represents."
/>
```

Required fields: title, summary, category, status. Optional: featured, tags, date (quoted ISO date), paper/code/dataset (absolute valid URLs), citation, cover (public image path), coverAlt. Status values: Published, Accepted, Under review, Submitted, Preprint, Ongoing, Independent exploration, Verification pending, Draft. Use only a supported, evidenced status. Draft entries are publicly readable if added; this is not a private draft CMS.

Use level-two plain-text headings for automatic table-of-contents links. Keep headings unique. Code fences, math via remark-math/KaTeX, images, Note, Diagram, and BenchmarkTable are supported. Markdown pipe tables require an additional GFM plugin; use BenchmarkTable for structured data with the current configuration. For a guaranteed benchmark table use:

```mdx
<BenchmarkTable
  rows={[
    {
      metric: "Metric",
      value: "Verified value",
      context: "Hardware, workload, and method",
    },
  ]}
/>
```

Do not add illustrative benchmark numbers to real case studies. Add local images under `public/images` and provide alt text; cover images use Next Image. Do not add remote image hosts without configuring an explicit allowlist.

Research notes should document question, abstract, motivation, methods, architecture, experimental setup, results, limitations, reproducibility, and verified citation. Project notes should cover problem, architecture, decisions, implementation, challenges, tests, results, limitations, and future work.

Configure verified public email and professional profiles in `src/lib/profile.ts`. Configure PDFs and photographs in `src/lib/assets.ts`; see RESUME-LIBRARY.md and IDENTITY-ASSETS.md. Empty profile values omit links; null asset entries use deliberate empty states. Timeline dates and institutional research affiliations must be confirmed before adding them.

Run validation and build after editing. `scripts/seed-content.mjs` records the original placeholder generation; do not rerun it over edited case studies.
