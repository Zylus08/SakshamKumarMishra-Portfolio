"use client";
import { useState } from "react";
export function Field() {
  const [view, setView] = useState<"signal" | "structure">("signal");
  return (
    <div className="field">
      <div className="field-label micro">
        <span>
          FIG. 01 /{" "}
          {view === "signal" ? "REPRESENTATION FIELD" : "STRUCTURAL FIELD"}
        </span>
        <span>SKM—LAB</span>
      </div>
      <svg
        viewBox="0 0 700 330"
        role="img"
        aria-label="Illustrative mathematical field, a visual study of signal and structure"
      >
        <defs>
          <linearGradient id="field-ink">
            <stop stopColor="#596e83" />
            <stop offset=".55" stopColor="#cf9874" />
            <stop offset="1" stopColor="#596e83" />
          </linearGradient>
        </defs>
        {Array.from({ length: 27 }, (_, row) => (
          <path
            key={row}
            d={Array.from({ length: 101 }, (_, i) => {
              const x = 35 + i * 6.3;
              const bump = Math.exp(-Math.pow((i - 50) / 24, 2));
              const y =
                80 +
                row * 6 +
                (view === "signal"
                  ? Math.sin(i * 0.075 + row * 0.16) * bump * 100
                  : Math.cos(i * 0.13) * bump * (60 - row));
              return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(" ")}
            fill="none"
            stroke="url(#field-ink)"
            strokeWidth=".85"
            opacity={0.35 + row / 45}
          />
        ))}
      </svg>
      <div className="field-bottom">
        <span className="micro">BETWEEN SIGNAL & STRUCTURE</span>
        <button
          aria-label="Change field visualization"
          onClick={() => setView(view === "signal" ? "structure" : "signal")}
        >
          Explore {view === "signal" ? "structure" : "signal"} ↗
        </button>
      </div>
    </div>
  );
}
