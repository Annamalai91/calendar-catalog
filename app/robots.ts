import type { MetadataRoute } from "next";
import { INDEXING, SITE_CONFIG } from "@configs/constants";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? SITE_CONFIG.defaultBaseUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: INDEXING.userAgent,
      allow: INDEXING.allow,
      disallow: [...INDEXING.disallow],
    },
    sitemap: `${BASE_URL}${INDEXING.sitemapPath}`,
  };
}
