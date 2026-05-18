import type { Product } from "@shared/types/product";

/** Props for ProductCard */
export interface ProductCardProps {
  product: Product;
  className?: string;
  onPreview?: (product: Product) => void;
}

/** Props for ProductGrid */
export interface ProductGridProps {
  products: Product[];
  className?: string;
}

/** Props for ProductDetails (detail page) */
export interface ProductDetailsProps {
  product: Product;
}

/** Props for ProductGallery */
export interface ProductGalleryProps {
  mainImage: string;
  secondaryImage: string;
  alt: string;
}

/** Props for ProductFilter sidebar */
export interface ProductFilterProps {
  categories: string[];
  subCategoriesByCategory: Record<string, string[]>;
  paperTypes: string[];
  activeCategory?: string;
  activeSubCategory?: string;
  activePaperType?: string;
}
