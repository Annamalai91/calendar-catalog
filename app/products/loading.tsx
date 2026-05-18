import { ProductGridSkeleton } from "@components/product/product-skeleton";

export default function ProductsLoading() {
  return (
    <div className="px-8 py-8 mx-auto max-w-360">
      <div className="flex gap-8">
        <div className="hidden lg:block w-56 shrink-0" />
        <div className="flex-1">
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
