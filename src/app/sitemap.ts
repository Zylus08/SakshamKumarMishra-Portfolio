import type { MetadataRoute } from "next";
import { allEntries } from "@/lib/content";
import { navigation } from "@/lib/profile";
import { canonicalOrigin as origin } from "@/lib/site-metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: origin + "/contact" },
    ...navigation.map((n) => ({ url: origin + n.href })),
    ...allEntries()
      .filter(
        (e) => e.status !== "Verification pending" && e.status !== "Draft",
      )
      .map((e) => ({ url: `${origin}/${e.kind}/${e.slug}` })),
  ];
}
