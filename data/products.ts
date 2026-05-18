import templateJson from "@/configs/template.json";
import type { Product, ProductsByCategory } from "@shared/types/product";
import { toSlug } from "@lib/utils/slug";

/** Raw products loaded from template.json — enriched with computed slug */
export const getAllProducts = (): Product[] =>
  (templateJson as Omit<Product, "slug">[]).map((p) => ({
    ...p,
    slug: toSlug(p.name),
  }));

/** Returns a single product by slug, or undefined if not found */
export const getProductBySlug = (slug: string): Product | undefined =>
  getAllProducts().find((p) => p.slug === slug);

/** Returns all unique main categories */
export const getAllCategories = (): string[] => [
  ...new Set(getAllProducts().map((p) => p.main_category)),
];

/** Returns all unique sub-categories */
export const getAllSubCategories = (): string[] => [
  ...new Set(getAllProducts().map((p) => p.size ?? p.sub_category)),
];

/** Groups products by main_category */
export const getProductsByCategory = (): ProductsByCategory =>
  getAllProducts().reduce<ProductsByCategory>((acc, product) => {
    const cat = product.main_category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

/** Returns products filtered by main_category slug */
export const getProductsByCategorySlug = (categorySlug: string): Product[] =>
  getAllProducts().filter((p) => toSlug(p.main_category) === categorySlug);

/** Returns all category slugs — for static params generation */
export const getAllCategorySlugs = (): string[] =>
  getAllCategories().map(toSlug);

/** Returns all product slugs — for static params generation */
export const getAllProductSlugs = (): string[] =>
  getAllProducts().map((p) => p.slug ?? toSlug(p.name));
