import type { MetadataRoute } from "next";
import { allEntries } from "@/lib/content";
import { origin, navigation } from "@/lib/profile";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navigation.map((n) => ({ url: origin + n.href })),
    ...allEntries()
      .filter(
        (e) => e.status !== "Verification pending" && e.status !== "Draft",
      )
      .map((e) => ({ url: `${origin}/${e.kind}/${e.slug}` })),
  ];
}
