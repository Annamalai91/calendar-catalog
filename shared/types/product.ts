/** Shared product type — single source of truth for all product data */
export interface Product {
  id?: string;
  name: string;
  main_category: string;
  sub_category: string;
  category_id?: string;
  sub_category_id?: string;
  size?: string;
  cover_image: string;
  full_image: string;
  paper_type: string;
  description: string;
  tag?: string;
  advt_space?: string;
  /** Optional SEO overrides — falls back to name/description if omitted */
  meta_title?: string;
  meta_description?: string;
  /** Computed from name — used for URL routing */
  slug?: string;
}


/** Category record from Supabase */
export interface Category {
  id: string;
  name: string;
  display_order: number;
  created_at?: string;
}

/** SubCategory record from Supabase */
export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  display_order: number;
  created_at?: string;
}

/** Category item enriched with display_order and numbered title */
export interface FormattedCategory {
  name: string; // e.g. "Die Cutting"
  display_order: number; // e.g. 1
  label: string; // e.g. "1. Die Cutting"
  slug: string; // e.g. "die-cutting"
}

/** SubCategory item enriched with display_order and numbered title */
export interface FormattedSubCategory {
  name: string; // e.g. "20 x 30"
  display_order: number; // e.g. 1
  label: string; // e.g. "1. 20 x 30"
  slug: string; // e.g. "20-x-30"
}

/** Grouped products by main category */
export type ProductsByCategory = Record<string, Product[]>;

/** Supported paper types */
export type PaperType = "Art" | "Gloss" | "Matte" | "Recycled" | string;

/** Filter state for the catalog */
export interface ProductFilter {
  category?: string;
  sub_category?: string;
  paper_type?: PaperType;
  tag?: string;
  query?: string;
}

/** Pagination state */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

