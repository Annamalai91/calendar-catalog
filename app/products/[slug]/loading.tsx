import { ProductDetailSkeleton } from "@components/product/product-skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="px-8 py-8 lg:py-12 mx-auto max-w-360">
      <ProductDetailSkeleton />
    </div>
  );
}
