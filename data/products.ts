import { supabase } from "@lib/supabase/client";
import type { Product, ProductsByCategory } from "@shared/types/product";
import { toSlug } from "@lib/utils/slug";

/** Raw products loaded from Supabase — enriched with computed slug */
export const getAllProducts = async (): Promise<Product[]> => {
  const hasEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!hasEnv) {
    console.warn("Supabase environment variables not found.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching products from Supabase:", error.message);
      return [];
    }

    return (data || []).map((p) => ({
      ...p,
      slug: toSlug(p.name),
    }));
  } catch (err) {
    console.error("Unexpected error fetching products:", err);
    return [];
  }
};

/** Returns a single product by slug, or undefined if not found */
export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
};

/** Returns all unique main categories */
export const getAllCategories = async (): Promise<string[]> => {
  const products = await getAllProducts();
  return [
    ...new Set(products.map((p) => p.main_category)),
  ];
};

/** Returns all unique sub-categories */
export const getAllSubCategories = async (): Promise<string[]> => {
  const products = await getAllProducts();
  return [
    ...new Set(products.map((p) => p.size ?? p.sub_category)),
  ];
};

/** Groups products by main_category */
export const getProductsByCategory = async (): Promise<ProductsByCategory> => {
  const products = await getAllProducts();
  return products.reduce<ProductsByCategory>((acc, product) => {
    const cat = product.main_category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});
};

/** Returns products filtered by main_category slug */
export const getProductsByCategorySlug = async (categorySlug: string): Promise<Product[]> => {
  const products = await getAllProducts();
  return products.filter((p) => toSlug(p.main_category) === categorySlug);
};

/** Returns all category slugs — for static params generation */
export const getAllCategorySlugs = async (): Promise<string[]> => {
  const categories = await getAllCategories();
  return categories.map(toSlug);
};

/** Returns all product slugs — for static params generation */
export const getAllProductSlugs = async (): Promise<string[]> => {
  const products = await getAllProducts();
  return products.map((p) => p.slug ?? toSlug(p.name));
};

