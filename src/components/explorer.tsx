"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { List, LayoutGrid, ArrowUpRight, Search } from "lucide-react";
import { filterEntries, type ExplorerItem } from "@/lib/explorer-filter";
import { projectCategories } from "@/lib/project-categories";

function subscribeCategory(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("skm:category", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("skm:category", callback);
  };
}
const categorySnapshot = () =>
  new URLSearchParams(window.location.search).get("category") || "All";
const serverCategory = () => "All";
function revealCard(button: HTMLButtonElement) {
  const strip = button.parentElement;
  if (!strip || strip.scrollWidth <= strip.clientWidth) return;
  const card = button.getBoundingClientRect(),
    frame = strip.getBoundingClientRect();
  const delta =
    card.left < frame.left + 6
      ? card.left - frame.left - 6
      : card.right > frame.right - 6
        ? card.right - frame.right + 6
        : 0;
  // Only the horizontal strip moves; never scroll the document on selection.
  if (delta) strip.scrollBy({ left: delta, behavior: "instant" });
}
export function Explorer({
  entries,
  kind,
  covers = [],
}: {
  entries: ExplorerItem[];
  kind: "research" | "projects" | "writing";
  covers?: { category: string; image: ReactNode }[];
}) {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("All"),
    [grid, setGrid] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const urlCategory = useSyncExternalStore(
    subscribeCategory,
    categorySnapshot,
    serverCategory,
  );
  const visibleEntries =
    kind === "writing"
      ? entries.filter((entry) => entry.status === "Published")
      : entries;
  const categories = [
    "All",
    ...new Set([
      ...(kind === "projects"
        ? projectCategories
        : kind === "writing"
          ? [
              "Research Notes",
              "Engineering",
              "Essays",
              "Poetry",
              "Personal Reflections",
            ]
          : []),
      ...visibleEntries.map((e) => e.category),
    ]),
  ];
  const category = categories.includes(urlCategory) ? urlCategory : "All";
  useEffect(() => {
    const button = galleryRef.current?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (button) revealCard(button);
  }, [category]);
  function setCategory(next: string) {
    if (next === category) return;
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    // Native history keeps the page and scroll position; popstate restores selection.
    window.history.pushState(window.history.state, "", url);
    window.dispatchEvent(new Event("skm:category"));
  }
  const filtered = filterEntries(visibleEntries, category, query, status);
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
        {kind !== "writing" && (
          <select
            aria-label={`Filter ${kind} status`}
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
      {kind === "writing" && covers.length > 0 && (
        <div
          className="category-covers"
          ref={galleryRef}
          aria-label="Explore writing categories"
          role="group"
          data-active={covers.some((cover) => cover.category === category)}
        >
          {covers.map((cover) => (
            <button
              key={cover.category}
              type="button"
              className="category-cover"
              aria-label={`Browse ${cover.category}`}
              aria-pressed={category === cover.category}
              aria-controls="writing-results"
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  revealCard(event.currentTarget);
              }}
              onClick={() => {
                setCategory(cover.category);
              }}
            >
              {cover.image}
              <span className="category-cover-title">
                {cover.category} <span aria-hidden="true">↗</span>
              </span>
              <span className="micro">
                {visibleEntries.filter(
                  (entry) => entry.category === cover.category,
                ).length || "No"}{" "}
                published entries
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="micro result-count" aria-live="polite">
        {kind === "writing" && category !== "All" ? `${category} / ` : ""}
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </p>
      <div
        id={kind === "writing" ? "writing-results" : undefined}
        className={kind === "writing" ? "writing-results" : undefined}
        role="region"
        aria-label={`${category} ${kind} entries`}
      >
        <div
          key={category}
          className={
            kind === "writing" ? "writing-result-transition" : undefined
          }
        >
          <div className={grid ? "entries grid" : "entries"}>
            {filtered.map((e, i) => (
              <Link href={`/${kind}/${e.slug}`} className="entry" key={e.slug}>
                <span className="entry-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="micro">
                    {e.category}
                    {e.tier ? ` / ${e.tier}` : ""}
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
                {visibleEntries.length
                  ? "Try another search or clear the filters."
                  : "A place for considered ideas. Writing will appear here when it is ready."}
              </p>
              {visibleEntries.length > 0 && (
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
        </div>
      </div>
    </>
  );
}
