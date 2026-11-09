# Resume and academic CV library

The four categories are Software Engineering, Machine Learning / AI, Quantitative Research, and Academic / Research CV. Their metadata lives in `src/lib/assets.ts` as typed `ProfessionalDocument` records. Milestone 2.2 integrates the supplied `Saksham_Mishra_SWE_Resume.pdf`, `Saksham_Mishra_ML_Resume.pdf`, and `Saksham_Mishra_Quant_Resume.pdf` unchanged. The academic CV remains `null` and has no download/preview link.

All three documents were parsed and visually reviewed (SWE and ML: one page each; Quant: two pages). They identify Saksham Mishra and match the intended categories. Their education lists IIT Bombay while the portfolio lists Thapar; resolve this discrepancy before launch. Supplied achievement/benchmark claims and embedded links are not independently verified by integration. No claims were copied into website content. See `MILESTONE-2.2-REPORT.md`.

## Add or replace a document

1. Place the reviewed authentic PDF in `public/documents/`, for example your own clearly named filename. Avoid spaces and punctuation beyond hyphens/underscores.
2. Set the corresponding record's `file` to its `/documents/...pdf` URL. `null` means unavailable.
3. Review its title, short description, type, and `downloadName`. The download filename should identify Saksham and the document purpose, and end in `.pdf`.
4. Run `npm run validate:content`, the build, and unit/browser tests. Rebuild/deploy only under the usual authorization process.

To replace a version, replace the file at the configured path or update the `file` value. The UI needs no change. For cache-sensitive updates, prefer a new versioned source filename while keeping a human-friendly download filename.

## Behavior

`availableDocuments()` resolves local files inside `public/documents`, rejects traversal, outside symlinks, wrong extensions and invalid download names, and checks the PDF header. Missing entries do not create links. The navbar's native `details` disclosure supports keyboard activation, Escape to close/focus its trigger, and outside-pointer dismissal. It preserves the existing five navigation tabs.

`DocumentSelector` renders the same available entries in the navbar and About page. Each entry has title, description, type, Download, and a new-tab Preview with secure link attributes. If none are available, a clear message appears instead of broken controls. PDF viewing behavior depends on the browser; the preview link still points to the actual PDF.

The validation command fails on a configured-but-invalid file. The runtime selector also filters it defensively. Header checks establish a plausible PDF, not semantic correctness or accessibility: open the authentic PDF, check its content, and ensure selectable text and accessible tagging before public launch.

Tests use isolated synthetic file signatures and render fixtures only; those fixtures are not public resumes and are cleaned up after tests.
