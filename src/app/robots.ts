import type { MetadataRoute } from "next";
import { isTemplateSite, siteConfig } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (isTemplateSite) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
