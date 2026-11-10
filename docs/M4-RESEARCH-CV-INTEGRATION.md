# M4 Academic / Research CV integration

Reviewed 2026-11-10. The workspace has no root `documents` directory. The newly supplied file was already in the established asset directory at `public/documents/Saksham_Mishra_CV.pdf`; it was the only plausible Academic CV candidate. No duplicate copy or regenerated PDF was needed.

## Identity and validation

The PDF identifies Saksham Mishra, the supplied contact inbox and Thapar education, and contains Research Statement, Education, Research Experience, Technical Skills, Awards and Honors, Extracurricular Activities and Languages sections. It is distinct from the three category-specific résumés.

- Four pages, each US Letter (612 × 792 PDF points).
- PDF 1.4, unencrypted, selectable text; all pages parsed and rendered successfully with PyMuPDF.
- Metadata title: `Saksham_Mishra_CV`; producer: `Skia/PDF m159 Google Docs Renderer`.
- Author, creation date and modification date metadata are blank; no metadata was invented or rewritten.
- No embedded files. All four rendered pages were visually inspected for readable content and clipping; the supplied layout was retained.
- Size: 109,526 bytes. SHA-256: `67df9612c7f949aa9a85ff196522faaedaf86f7d69f0eef5ad311eabd71e53cc`.

This verifies file identity, parsing and presentation, not independent truth of every authored achievement or publication claim. No CV claims, affiliations or benchmark values were copied into portfolio articles. No editing, reflow, compression or metadata changes were applied. Rendered review images remain ignored under `.tmp/m4-cv/`.

## Integration

The existing typed academic document record now points to `/documents/Saksham_Mishra_CV.pdf`, with download name `Saksham-Kumar-Mishra-Academic-CV.pdf`.

The navbar résumé disclosure and About-page cards automatically show all four validated documents through their existing shared components. The Research archive adds one contextual Academic CV download using the same `availableDocuments()` gate. Download/preview labels identify the document and PDF format; previews retain secure new-tab attributes. Missing/invalid-document fallback behavior remains covered by existing unit tests. Five primary tabs remain unchanged.

Intended production URL after authorized deployment: [Academic CV](https://www.sakshamkumarmishra.cv/documents/Saksham_Mishra_CV.pdf). Local browser verification checks HTTP 200, `application/pdf`, actual download filename and full response/download hashes. This URL is not claimed deployed merely because it is configured locally.

## Byte preservation

The pre-integration snapshot is enforced by `tests/fixtures/document-integrity.json` and unit/browser tests. The three corrected résumés each parse as two pages and contain Thapar, not IIT Bombay. Historical M2.2 notes refer to earlier versions; the current library documentation now distinguishes those versions.

| File | Bytes | SHA-256 |
|---|---:|---|
| `Saksham_Mishra_CV.pdf` | 109526 | `67df9612c7f949aa9a85ff196522faaedaf86f7d69f0eef5ad311eabd71e53cc` |
| `Saksham_Mishra_SWE_Resume.pdf` | 161898 | `d49535eb2bb0c63295bab1a56013aca10bfdbf0f55a6742dad4c6335adc205de` |
| `Saksham_Mishra_ML_Resume.pdf` | 162847 | `9836b77db64cabf87f25358e0053e6ccd8bc23fd79b047bd861a61d801be444a` |
| `Saksham_Mishra_Quant_Resume.pdf` | 190903 | `0b4e6e1e93b6e281e4ffecd7520652f4018d12c827e138007cd27114870e3e8a` |

Local integration is complete. Production publication remains pending authorization and deployment. See [verification](M4-VERIFICATION.md) for actual test outcomes and status.
