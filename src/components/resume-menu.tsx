"use client";
import { useEffect, useRef } from "react";
import type { ProfessionalDocument } from "@/lib/assets";
import { DocumentSelector } from "./document-selector";
export function ResumeMenu({
  documents,
}: {
  documents: ProfessionalDocument[];
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        ref.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <details
      ref={ref}
      className="resume-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>
        Resume <span aria-hidden="true">⌄</span>
      </summary>
      <div className="resume-popover">
        <p className="eyebrow">DOCUMENT LIBRARY</p>
        <DocumentSelector documents={documents} />
      </div>
    </details>
  );
}
