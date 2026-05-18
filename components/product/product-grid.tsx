"use client";

import { useState } from "react";
import { cn } from "@lib/utils";
import ProductCard from "./product-card";
import ProductPreviewDialog from "./product-preview-dialog";
import type { ProductGridProps } from "./type";

/**
 * ProductGrid — responsive grid layout for product cards.
 *
 * Figma source: "Main" frame in Product Selection
 *   - itemSpacing: 28px (gap-7)
 *   - layoutMode: VERTICAL, fills available width
 *
 * Client Component — owns product preview dialog state.
 */
const ProductGrid = ({ products, className }: ProductGridProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const safePreviewIndex =
    products.length === 0 ? 0 : Math.min(previewIndex, products.length - 1);

  const handlePreview = (productIndex: number) => {
    setPreviewIndex(productIndex);
    setPreviewOpen(true);
  };

  const handlePrevious = () => {
    setPreviewIndex((currentIndex) =>
      products.length === 0
        ? 0
        : (currentIndex - 1 + products.length) % products.length,
    );
  };

  const handleNext = () => {
    setPreviewIndex((currentIndex) =>
      products.length === 0 ? 0 : (currentIndex + 1) % products.length,
    );
  };

  const handleNavigate = (nextIndex: number) => {
    setPreviewIndex(nextIndex);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Product grid"
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.slug ?? product.name}
          product={product}
          onPreview={() => handlePreview(index)}
        />
      ))}
      <ProductPreviewDialog
        open={previewOpen}
        products={products}
        index={safePreviewIndex}
        onOpenChange={setPreviewOpen}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onNavigate={handleNavigate}
      />
    </section>
  );
};

export default ProductGrid;
