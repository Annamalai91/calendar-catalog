import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCategorySlugs } from "@data/products";
import { SITEMAP, SITE_CONFIG } from "@configs/constants";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? SITE_CONFIG.defaultBaseUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getAllProductSlugs();
  const categorySlugs = await getAllCategorySlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: SITEMAP.frequencies.home,
      priority: SITEMAP.priorities.home,
    },
    {
      url: `${BASE_URL}${SITEMAP.staticRoutes.productsPath}`,
      lastModified: new Date(),
      changeFrequency: SITEMAP.frequencies.products,
      priority: SITEMAP.priorities.products,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/products?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: SITEMAP.frequencies.category,
    priority: SITEMAP.priorities.category,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: SITEMAP.frequencies.product,
    priority: SITEMAP.priorities.product,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
