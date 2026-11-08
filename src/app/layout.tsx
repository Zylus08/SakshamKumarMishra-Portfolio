import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { allEntries } from "@/lib/content";
import { origin, profile } from "@/lib/profile";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
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
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header
          entries={allEntries().map((e) => ({
            label: e.title,
            href: `/${e.kind}/${e.slug}`,
          }))}
        />
        <main id="main">{children}</main>
        <footer className="footer">
          <div>
            <Link href="/" className="brand">
              SKM<span>.</span>
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
