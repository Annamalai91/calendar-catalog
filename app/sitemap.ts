import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCategorySlugs } from "@data/products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://calenders-arun.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const productSlugs = getAllProductSlugs();
  const categorySlugs = getAllCategorySlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/products?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
