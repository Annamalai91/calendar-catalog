import type { Product, FormattedCategory, FormattedSubCategory } from "@shared/types/product";

/** Props for ProductCard */
export interface ProductCardProps {
  product: Product;
  className?: string;
  onPreview?: (product: Product) => void;
  priority?: boolean;
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
  coverImage: string;
  fullImage: string;
  alt: string;
}

/** Props for ProductFilter sidebar */
export interface ProductFilterProps {
  categories: (string | FormattedCategory)[];
  subCategoriesByCategory: Record<string, (string | FormattedSubCategory)[]>;
  activeCategory?: string;
  activeSubCategory?: string;
}

