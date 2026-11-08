"use client";
import { useState } from "react";
import Link from "next/link";
import { List, LayoutGrid, ArrowUpRight, Search } from "lucide-react";
type Item = {
  title: string;
  summary: string;
  category: string;
  status: string;
  slug: string;
  tags: string[];
  featured: boolean;
};
export function Explorer({
  entries,
  kind,
}: {
  entries: Item[];
  kind: "research" | "projects" | "writing";
}) {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [status, setStatus] = useState("All"),
    [grid, setGrid] = useState(false);
  const categories = [
    "All",
    ...new Set([
      ...(kind === "projects"
        ? [
            "Machine Learning",
            "Systems Engineering",
            "Quantitative Research",
            "Web & Applications",
            "Experimental Projects",
          ]
        : kind === "writing"
          ? [
              "Research Notes",
              "Engineering",
              "Essays",
              "Poetry",
              "Personal Reflections",
            ]
          : []),
      ...entries.map((e) => e.category),
    ]),
  ];
  const filtered = entries.filter(
    (e) =>
      (category === "All" || e.category === category) &&
      (status === "All" || e.status === status) &&
      `${e.title} ${e.summary} ${e.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="explorer-controls">
        <label className="search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${kind}…`}
            aria-label={`Search ${kind}`}
          />
        </label>
        {kind === "research" && (
          <select
            aria-label="Filter research status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All", ...new Set(entries.map((e) => e.status))].map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        )}
        {kind === "projects" && (
          <button
            className="view-toggle"
            onClick={() => setGrid(!grid)}
            aria-label={grid ? "Show list view" : "Show grid view"}
          >
            {grid ? <List size={20} /> : <LayoutGrid size={20} />}
          </button>
        )}
      </div>
      <div className="filters" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="micro result-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </p>
      <div className={grid ? "entries grid" : "entries"}>
        {filtered.map((e, i) => (
          <Link href={`/${kind}/${e.slug}`} className="entry" key={e.slug}>
            <span className="entry-index">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="micro">
                {e.category}
                {e.featured ? " / SELECTED" : ""}
              </div>
              <h2>{e.title}</h2>
              <p>{e.summary}</p>
              <div className="tags">
                {e.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="entry-end">
              <ArrowUpRight size={24} />
              <span className="status">{e.status}</span>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty">
          <h2>No entries here. Yet.</h2>
          <p>
            {entries.length
              ? "Try another search or clear the filters."
              : "A place for considered ideas. Writing will appear here when it is ready."}
          </p>
          {entries.length > 0 && (
            <button
              className="text-link"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setStatus("All");
              }}
            >
              Clear filters ↗
            </button>
          )}
        </div>
      )}
    </>
  );
}
