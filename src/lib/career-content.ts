import { getEntries, type Entry } from "./content";
import { availableDocuments } from "./asset-files";
import {
  careerPathways,
  homepageProjectOrder,
  projectPreviews,
} from "./career-pathways";
import { homepageProjectLimit } from "./project-categories";

export function homepageProjects(entries = getEntries("projects")) {
  const featured = entries.filter((entry) => entry.featured);
  if (
    homepageProjectOrder.length !== homepageProjectLimit ||
    new Set(homepageProjectOrder).size !== homepageProjectLimit ||
    featured.length !== homepageProjectLimit
  )
    throw new Error(
      "Homepage curation must retain seven distinct featured projects",
    );
  return homepageProjectOrder.map((slug) => {
    const entry = featured.find((item) => item.slug === slug);
    if (!entry || !projectPreviews[slug])
      throw new Error(`Invalid homepage selection: ${slug}`);
    return { ...entry, preview: projectPreviews[slug] };
  });
}

export function resolvedPathways() {
  const catalogue: Entry[] = [
    ...getEntries("projects"),
    ...getEntries("research"),
  ];
  const documents = availableDocuments();
  return careerPathways.map((pathway) => ({
    ...pathway,
    document: documents.find((doc) => doc.id === pathway.documentId) || null,
    entries: pathway.slugs.map((slug, index) => {
      const entry = catalogue.find(
        (item) => item.slug === slug && item.kind === pathway.kind,
      );
      if (!entry || !entry.evidence || entry.status === "Verification pending")
        throw new Error(`Pathway requires an evidenced case study: ${slug}`);
      return {
        title: entry.title,
        href: `/${entry.kind}/${entry.slug}`,
        rationale: pathway.rationales[index],
      };
    }),
  }));
}
export type ResolvedPathway = ReturnType<typeof resolvedPathways>[number];
