import type { ProductFilter } from "@shared/types/product";

/** Page-level props for the products catalog page */
export interface ProductsPageSearchParams {
  category?: string;
  sub?: string;
  paper?: string;
  page?: string;
  q?: string;
}

/** Resolved filter state from URL search params */
export type ResolvedFilter = ProductFilter & {
  pageNumber: number;
};
