import { notFound } from "next/navigation";
import { getEntries, kinds, type Kind } from "@/lib/content";
import { Explorer } from "@/components/explorer";
import { CategoryCover } from "@/components/category-cover";
import { writingCovers } from "@/lib/assets";
import { Reveal } from "@/components/reveal";
import { availableDocuments } from "@/lib/asset-files";
const descriptions = {
  research: {
    title: "Questions worth pursuing.",
    intro:
      "Machine intelligence, representation, and the constraints that make research interesting.",
  },
  projects: {
    title: "Thinking through building.",
    intro:
      "Experiments in machine learning, systems, and performance-oriented engineering.",
  },
  writing: {
    title: "Notes from the margins.",
    intro:
      "Research notes, engineering observations, and thoughts that take the longer way home.",
  },
};
export function generateStaticParams() {
  return kinds.map((collection) => ({ collection }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!kinds.includes(collection as Kind)) return {};
  return {
    title: collection[0].toUpperCase() + collection.slice(1),
    alternates: { canonical: `/${collection}` },
  };
}
export default async function Collection({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!kinds.includes(collection as Kind)) notFound();
  const kind = collection as Kind;
  const copy = descriptions[kind];
  const academicCV =
    kind === "research"
      ? availableDocuments().find((doc) => doc.id === "academic")
      : undefined;
  return (
    <Reveal>
      <div className="section archive">
        <header className="page-heading">
          <p className="eyebrow">SKM / {collection.toUpperCase()}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          {academicCV && (
            <p>
              <a
                className="text-link"
                href={academicCV.file!}
                download={academicCV.downloadName}
                aria-label="Download Academic / Research CV (PDF)"
              >
                Academic / Research CV ↓
              </a>
            </p>
          )}
        </header>
        <Explorer
          kind={kind}
          covers={
            kind === "writing"
              ? writingCovers.map(({ category, photo }) => ({
                  category,
                  image: <CategoryCover photo={photo} />,
                }))
              : []
          }
          entries={getEntries(kind).map(({ body, ...entry }) => {
            void body;
            return entry;
          })}
        />
      </div>
    </Reveal>
  );
}
