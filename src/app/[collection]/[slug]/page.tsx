import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { allEntries } from "@/lib/content";
import {
  Diagram,
  Note,
  BenchmarkTable,
  TableScroll,
} from "@/components/diagram";
import { ArticleContents } from "@/components/article-contents";
import {
  articleHeadings,
  rehypeArticleHeadings,
  rehypeArticleScrollRegions,
} from "@/lib/article-headings";
export function generateStaticParams() {
  return allEntries().map((e) => ({ collection: e.kind, slug: e.slug }));
}
async function entryFor(params: Promise<{ collection: string; slug: string }>) {
  const p = await params;
  return allEntries().find((e) => e.kind === p.collection && e.slug === p.slug);
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const e = await entryFor(params);
  return e
    ? {
        title: e.title,
        description: e.summary,
        alternates: { canonical: `/${e.kind}/${e.slug}` },
        robots:
          e.status === "Verification pending"
            ? { index: false, follow: true }
            : undefined,
      }
    : {};
}
export default async function Detail({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const e = await entryFor(params);
  if (!e) notFound();
  const headings = articleHeadings(e.body);
  return (
    <article className="section detail">
      <Link className="text-link" href={`/${e.kind}`}>
        ← Back to {e.kind}
      </Link>
      <header className="page-heading">
        <p className="eyebrow">
          {e.category} / {e.status}
        </p>
        <h1>{e.title}</h1>
        <p>{e.summary}</p>
        <div className="micro">
          {e.date && `${e.date} / `}
          {e.readingTime} MIN READ
        </div>
      </header>
      {e.cover && (
        <Image
          className="article-cover"
          src={e.cover}
          alt={e.coverAlt || e.title}
          width={1200}
          height={650}
        />
      )}
      <div className="article-layout">
        <ArticleContents headings={headings} />
        <div className="prose">
          <MDXRemote
            source={e.body}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [
                  rehypeArticleHeadings,
                  rehypeKatex,
                  rehypeArticleScrollRegions,
                ],
              },
            }}
            components={{
              Diagram,
              Note,
              BenchmarkTable,
              TableScroll,
              table: ({ children, ...props }) => (
                <TableScroll>
                  <table {...props}>{children}</table>
                </TableScroll>
              ),
            }}
          />
          {(e.paper || e.code || e.dataset || e.citation) && (
            <section>
              <h2>Links and citation</h2>
              {e.paper && (
                <p>
                  <a href={e.paper}>Read paper ↗</a>
                </p>
              )}
              {e.code && (
                <p>
                  <a href={e.code}>Source code ↗</a>
                </p>
              )}
              {e.dataset && (
                <p>
                  <a href={e.dataset}>Dataset ↗</a>
                </p>
              )}
              {e.citation && <pre>{e.citation}</pre>}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
