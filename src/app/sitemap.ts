import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, priority: 1, changeFrequency: "monthly" },
    ...projects.map((project) => ({
      url: `${siteConfig.url}/work/${project.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];
}
