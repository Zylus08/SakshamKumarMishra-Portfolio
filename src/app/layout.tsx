import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { allEntries } from "@/lib/content";
import { origin, profile } from "@/lib/profile";
import { availableDocuments } from "@/lib/asset-files";
import { BrandMark } from "@/components/brand-mark";
// Keep the existing typefaces; preload local files and align fallback metrics
// so late font loading does not reflow the compact hero around its portrait.
const sans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});
const serif = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const mono = localFont({
  src: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  fallback: ["monospace"],
});
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: "Saksham Kumar Mishra — Research & Engineering",
    template: "%s — SKM",
  },
  description:
    "The digital research atelier of Saksham Kumar Mishra. Machine intelligence, systems engineering, and ideas in between.",
  openGraph: {
    type: "website",
    siteName: "SKM — A Digital Research Atelier",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('skm-theme')==='light'?'light':'dark'}catch{}`,
          }}
        />
      </head>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header
          documents={availableDocuments()}
          entries={allEntries().map((e) => ({
            label: e.title,
            href: `/${e.kind}/${e.slug}`,
          }))}
        />
        <main id="main">{children}</main>
        <footer className="footer">
          <div>
            <Link href="/" className="brand">
              <BrandMark />
              <span className="brand-word">
                SKM<span>.</span>
              </span>
            </Link>
            <p>
              A digital research atelier.
              <br />
              Made with curiosity. Rooted in Delhi.
            </p>
          </div>
          <Contact />
          <div className="micro">
            © {new Date().getFullYear()} {profile.name}
            <br />
            28.6139° N · 77.2090° E
          </div>
        </footer>
      </body>
    </html>
  );
}
