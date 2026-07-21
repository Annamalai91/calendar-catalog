import { supabase } from "@lib/supabase/client";
import type { Product, ProductsByCategory, FormattedCategory, FormattedSubCategory } from "@shared/types/product";
import { toSlug } from "@lib/utils/slug";

/** Raw products loaded from Supabase — enriched with computed slug */
export const getAllProducts = async (): Promise<Product[]> => {
  const hasEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!hasEnv) {
    console.warn("Supabase environment variables not found.");
    return [];
  }

  try {
    let { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, display_order), sub_categories(id, name, display_order)")
      .order("name", { ascending: true });

    if (error) {
      // Fallback if joined query fails before schema migration
      const res = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error("Error fetching products from Supabase:", error.message);
      return [];
    }

    return (data || []).map((p: any) => ({
      ...p,
      name: p.name ?? "",
      description: p.description ?? "",
      main_category: p.categories?.name ?? p.main_category ?? "",
      sub_category: p.sub_categories?.name ?? p.sub_category ?? "",
      size: p.size ?? "",
      paper_type: p.paper_type ?? "",
      tag: p.tag ?? "",
      advt_space: p.advt_space ?? "",
      slug: toSlug(p.name ?? ""),
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

/** Returns formatted categories with numbers ordered by display_order */
export const getFormattedCategories = async (): Promise<FormattedCategory[]> => {
  const hasEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (hasEnv) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((cat) => ({
          name: cat.name,
          display_order: cat.display_order,
          label: cat.name,
          slug: toSlug(cat.name),
        }));
      }
    } catch (err) {
      console.error("Error fetching categories from Supabase:", err);
    }
  }

  // Fallback to products table if categories table isn't accessible
  const products = await getAllProducts();
  const rawCats = [...new Set(products.map((p) => p.main_category))];
  return rawCats.map((name, idx) => ({
    name,
    display_order: idx + 1,
    label: name,
    slug: toSlug(name),
  }));
};

/** Returns formatted subcategories grouped by category slug */
export const getFormattedSubCategoriesByCategory = async (): Promise<Record<string, FormattedSubCategory[]>> => {
  const hasEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (hasEnv) {
    try {
      const { data, error } = await supabase
        .from("sub_categories")
        .select("*, categories(name)")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const result: Record<string, FormattedSubCategory[]> = {};
        for (const sub of data) {
          const categoryName = sub.categories?.name;
          if (!categoryName) continue;
          const catSlug = toSlug(categoryName);
          if (!result[catSlug]) result[catSlug] = [];
          result[catSlug].push({
            name: sub.name,
            display_order: sub.display_order,
            label: sub.name,
            slug: toSlug(sub.name),
          });
        }
        return result;
      }

    } catch (err) {
      console.error("Error fetching sub categories from Supabase:", err);
    }
  }

  // Fallback if sub_categories table empty
  const allProducts = await getAllProducts();
  const result: Record<string, FormattedSubCategory[]> = {};
  for (const product of allProducts) {
    const catSlug = toSlug(product.main_category);
    const subName = product.size ?? product.sub_category;
    if (!subName) continue;
    if (!result[catSlug]) result[catSlug] = [];
    if (!result[catSlug].some((s) => s.name === subName)) {
      const idx = result[catSlug].length + 1;
      result[catSlug].push({
        name: subName,
        display_order: idx,
        label: subName,
        slug: toSlug(subName),
      });
    }
  }
  return result;
};

/** Returns all unique main categories (ordered by display_order) */
export const getAllCategories = async (): Promise<string[]> => {
  const formatted = await getFormattedCategories();
  return formatted.map((c) => c.name);
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


