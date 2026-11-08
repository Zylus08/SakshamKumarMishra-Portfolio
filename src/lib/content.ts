import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
export const kinds = ["research", "projects", "writing"] as const;
export type Kind = (typeof kinds)[number];
export const schema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string(),
  status: z.enum([
    "Published",
    "Accepted",
    "Under review",
    "Submitted",
    "Preprint",
    "Ongoing",
    "Independent exploration",
    "Verification pending",
    "Draft",
  ]),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  paper: z.string().url().optional(),
  code: z.string().url().optional(),
  dataset: z.string().url().optional(),
  citation: z.string().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
});
export type Entry = z.infer<typeof schema> & {
  slug: string;
  kind: Kind;
  body: string;
  readingTime: number;
};
export function getEntries(kind: Kind): Entry[] {
  const directory = path.join(process.cwd(), "src/content", kind);
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(directory, file), "utf8"),
      );
      return {
        ...schema.parse(data),
        slug: file.replace(/\.mdx$/, ""),
        kind,
        body: content,
        readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
      };
    })
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        a.title.localeCompare(b.title),
    );
}
export function allEntries() {
  return kinds.flatMap(getEntries);
}
