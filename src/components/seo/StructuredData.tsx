import { siteConfig } from "@/content/site";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    description: siteConfig.heroLead,
    sameAs: [siteConfig.github, siteConfig.linkedin],
  };

  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json">{json}</script>;
}
