import { ProductDetailSkeleton } from "@components/product/product-skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="px-8 lg:px-30 py-8 lg:py-12 mx-auto max-w-300">
      <ProductDetailSkeleton />
    </div>
  );
}
