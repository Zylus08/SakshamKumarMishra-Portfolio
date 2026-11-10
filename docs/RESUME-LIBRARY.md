# Resume and academic CV library

The four categories are Software Engineering, Machine Learning / AI, Quantitative Research, and Academic / Research CV. Their metadata lives in `src/lib/assets.ts` as typed `ProfessionalDocument` records. All four are now available locally. Milestone 4 integrates the supplied `Saksham_Mishra_CV.pdf` in place alongside the three corrected résumés, preserving every PDF byte.

The current corrected SWE, ML and Quant PDFs each have two pages and identify Thapar; the supplied Academic CV has four pages and also identifies Thapar. The older M2.2 report describes historical versions, not these current files. The Academic CV was parsed and all four pages visually inspected. Supplied achievement/benchmark claims are not independently verified by asset integration, and no claims were copied into website content. See [M4 CV integration](M4-RESEARCH-CV-INTEGRATION.md) for exact hashes and scope.

## Add or replace a document

1. Place the reviewed authentic PDF in `public/documents/`, for example your own clearly named filename. Avoid spaces and punctuation beyond hyphens/underscores.
2. Set the corresponding record's `file` to its `/documents/...pdf` URL. `null` means unavailable.
3. Review its title, short description, type, and `downloadName`. The download filename should identify Saksham and the document purpose, and end in `.pdf`.
4. Run `npm run validate:content`, the build, and unit/browser tests. Rebuild/deploy only under the usual authorization process.

To replace a version, replace the file at the configured path or update the `file` value. The UI needs no change. For cache-sensitive updates, prefer a new versioned source filename while keeping a human-friendly download filename.

## Behavior

`availableDocuments()` resolves local files inside `public/documents`, rejects traversal, outside symlinks, wrong extensions and invalid download names, and checks the PDF header. Missing entries do not create links. The navbar's native `details` disclosure supports keyboard activation, Escape to close/focus its trigger, and outside-pointer dismissal. It preserves the existing five navigation tabs.

`DocumentSelector` renders the same available entries in the navbar and About page. Each entry has title, description, type, Download, and a new-tab Preview with secure link attributes. If none are available, a clear message appears instead of broken controls. PDF viewing behavior depends on the browser; the preview link still points to the actual PDF.

The Research archive also exposes a contextual Academic CV download, gated through the same `availableDocuments()` check.

The validation command fails on a configured-but-invalid file. The runtime selector also filters it defensively. Header checks establish a plausible PDF, not semantic correctness or accessibility: open the authentic PDF, check its content, and ensure selectable text and accessible tagging before public launch.

Tests use isolated synthetic file signatures for invalid/missing-file cases and verify real public PDF responses and SHA-256 hashes against the pre-M4 integration snapshot. Synthetic fixtures are never public résumés and are cleaned up after tests.
