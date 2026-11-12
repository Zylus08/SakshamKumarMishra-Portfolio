import type { Metadata } from "next";

// SEO canonical host is separate from the existing application/contact origin policy.
export const canonicalOrigin = "https://www.sakshamkumarmishra.cv";
export const siteTitle =
  "Saksham Kumar Mishra — Quantitative Systems, ML & Research";
export const siteDescription =
  "Quantitative systems, applied machine learning and research-driven software by Saksham Kumar Mishra. Explore implementations, research methods and technical contributions.";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${canonicalOrigin}${path}`,
      siteName: "Saksham Kumar Mishra · SKM",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
