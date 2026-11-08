import { notFound } from "next/navigation";
import { getEntries, kinds, type Kind } from "@/lib/content";
import { Explorer } from "@/components/explorer";
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
  return (
    <div className="section archive">
      <header className="page-heading">
        <p className="eyebrow">SKM / {collection.toUpperCase()}</p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </header>
      <Explorer
        kind={kind}
        entries={getEntries(kind).map(({ body, ...entry }) => {
          void body;
          return entry;
        })}
      />
    </div>
  );
}
