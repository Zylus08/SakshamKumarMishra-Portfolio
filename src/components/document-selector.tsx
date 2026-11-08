import type { ProfessionalDocument } from "@/lib/assets";
export function DocumentSelector({
  documents,
}: {
  documents: ProfessionalDocument[];
}) {
  return (
    <div className="document-library">
      {documents.length ? (
        documents.map((doc) => (
          <div className="document-item" key={doc.id}>
            <p className="micro">{doc.type} / PDF</p>
            <h3>{doc.title}</h3>
            <p>{doc.description}</p>
            <div className="document-actions">
              <a
                href={doc.file!}
                download={doc.downloadName}
                aria-label={`Download ${doc.title} (PDF)`}
              >
                Download ↓
              </a>
              <a
                href={doc.file!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Preview ${doc.title} (PDF, opens in a new tab)`}
              >
                Preview ↗
              </a>
            </div>
          </div>
        ))
      ) : (
        <p className="document-empty">
          Resumes and the academic CV will be available here once the documents
          are added.
        </p>
      )}
    </div>
  );
}
