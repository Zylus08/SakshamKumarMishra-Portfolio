"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import type { ResolvedPathway } from "@/lib/career-content";

export function CareerPathways({ pathways }: { pathways: ResolvedPathway[] }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="career-pathways" id="career-pathways">
      <div className="career-heading">
        <p className="eyebrow">FOUR WAYS INTO THE WORK</p>
        <h3>
          One curiosity. <em>Different lenses.</em>
        </h3>
        <p>
          Choose a direction for a short reading list and the relevant résumé or
          CV.
        </p>
      </div>
      <div className="career-tabs" role="tablist" aria-label="Career pathways">
        {pathways.map((pathway, index) => (
          <button
            key={pathway.id}
            id={`career-tab-${pathway.id}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls={`career-panel-${pathway.id}`}
            tabIndex={selected === index ? 0 : -1}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % pathways.length
                  : event.key === "ArrowLeft"
                    ? (index + pathways.length - 1) % pathways.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? pathways.length - 1
                        : null;
              if (next === null) return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            <span className="micro" aria-hidden="true">
              0{index + 1}
            </span>
            {pathway.label}
          </button>
        ))}
      </div>
      {pathways.map((pathway, index) => (
        <div
          key={pathway.id}
          id={`career-panel-${pathway.id}`}
          role="tabpanel"
          aria-labelledby={`career-tab-${pathway.id}`}
          hidden={selected !== index}
          tabIndex={0}
        >
          <p className="career-statement">{pathway.statement}</p>
          <ol className="career-reading">
            {pathway.entries.map((entry) => (
              <li key={entry.href}>
                <h4>
                  <Link href={entry.href}>
                    {entry.title} <span aria-hidden="true">↗</span>
                  </Link>
                </h4>
                <p>{entry.rationale}</p>
              </li>
            ))}
          </ol>
          <div className="career-actions">
            {pathway.document ? (
              <a
                className="text-link"
                href={pathway.document.file!}
                download={pathway.document.downloadName}
                aria-label={`Download ${pathway.document.title} (PDF)`}
              >
                {pathway.document.title} <span aria-hidden="true">↓</span>{" "}
                <span className="micro">PDF</span>
              </a>
            ) : (
              <p>Document currently unavailable.</p>
            )}
            <Link className="text-link" href={pathway.moreHref}>
              {pathway.moreLabel} ↗
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
