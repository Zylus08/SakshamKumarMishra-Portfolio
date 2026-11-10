export type ArticleHeading = { id: string; title: string; level: 2 | 3 };

function headingId(title: string, seen: Map<string, number>) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const count = seen.get(base) || 0;
  seen.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
}

export function articleHeadings(source: string): ArticleHeading[] {
  const seen = new Map<string, number>();
  let fence = "";
  const result: ArticleHeading[] = [];
  for (const line of source.split("\n")) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
        fence = "";
      continue;
    }
    if (fence) continue;
    const match = line.match(/^(#{2,3}) (.+?)(?:\s+#+)?\s*$/);
    if (!match) continue;
    const title = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "");
    result.push({
      id: headingId(title, seen),
      title,
      level: match[1].length as 2 | 3,
    });
  }
  return result;
}

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  children?: Node[];
  properties?: Record<string, unknown>;
};
const nodeText = (node: Node): string =>
  node.type === "text"
    ? node.value || ""
    : (node.children || []).map(nodeText).join("");

// Runs on parsed HTML, so formatting inside headings keeps its visible-text anchor.
export function rehypeArticleHeadings() {
  return (tree: Node) => {
    const seen = new Map<string, number>();
    function visit(node: Node) {
      if (node.tagName === "h2" || node.tagName === "h3") {
        node.properties = {
          ...node.properties,
          id: headingId(nodeText(node), seen),
        };
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

export function rehypeArticleScrollRegions() {
  return (tree: Node) => {
    function visit(node: Node) {
      const classes = node.properties?.className;
      const math = Array.isArray(classes) && classes.includes("katex-display");
      if (node.tagName === "pre" || math) {
        node.properties = {
          ...node.properties,
          tabIndex: 0,
          role: "region",
          ariaLabel: math
            ? "Scrollable mathematical equation"
            : "Scrollable code example",
        };
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
