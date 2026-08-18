import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/layout/ClientShell";
import { StructuredData } from "@/components/seo/StructuredData";
import { isTemplateSite, siteConfig } from "@/content/site";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// Fraunces carries more identity than Playfair at display sizes; `opsz` lets the
// hero name and small serif headings share one variable face.
const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.heroLead,
  applicationName: `${siteConfig.name} Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  category: "portfolio",
  robots: isTemplateSite ? { index: false, follow: false, noarchive: true } : { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.heroLead,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.heroLead,
  },
};

export const viewport: Viewport = {
  themeColor: "#18130f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <noscript><style>{`.reveal{opacity:1!important;transform:none!important}`}</style></noscript>
        <StructuredData />
        <Link className="skip-link" href="/#work">Skip to work</Link>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
