import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import Silk from "@/components/Silk";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/data/site";
import { siteUrl } from "@/data/url";

const name = `${site.firstName} ${site.lastName}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${name} — UI/UX Designer`, template: `%s — ${name}` },
  description: site.intro,
  openGraph: {
    type: "website",
    siteName: name,
    title: `${name} — UI/UX Designer`,
    description: site.intro,
    images: [{ url: "/anila-portrait.jpg", alt: name }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="intro-on intro-hold" suppressHydrationWarning>
      <body>
        <Intro />
        <Cursor />
        <SmoothScroll />
        <Nav />
        <div className="shell">
          <Silk />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
