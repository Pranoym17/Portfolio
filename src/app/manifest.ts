import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Portfolio`,
    short_name: siteConfig.shortName,
    description: siteConfig.heroLead,
    start_url: "/",
    display: "standalone",
    background_color: "#18130f",
    theme_color: "#18130f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
