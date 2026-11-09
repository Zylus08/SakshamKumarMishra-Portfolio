export type ExplorerItem = {
  title: string;
  summary: string;
  category: string;
  status: string;
  slug: string;
  tags: string[];
  featured: boolean;
  tier?: "Flagship" | "Case study" | "Archive" | "Experiment";
};

export function filterEntries(
  entries: ExplorerItem[],
  category: string,
  query: string,
  status = "All",
) {
  const search = query.trim().toLowerCase();
  return entries.filter(
    (entry) =>
      (category === "All" || entry.category === category) &&
      (status === "All" || entry.status === status) &&
      `${entry.title} ${entry.summary} ${entry.tags.join(" ")}`
        .toLowerCase()
        .includes(search),
  );
}
