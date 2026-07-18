/** Shared product type — single source of truth for all product data */
export interface Product {
  name: string;
  main_category: string;
  sub_category: string;
  size?: string;
  cover_image: string;
  full_image: string;
  paper_type: string;
  description: string;
  tag?: string;
  /** Optional SEO overrides — falls back to name/description if omitted */
  meta_title?: string;
  meta_description?: string;
  /** Computed from name — used for URL routing */
  slug?: string;
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
