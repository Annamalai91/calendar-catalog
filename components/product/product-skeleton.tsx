import { Skeleton } from "@components/ui/skeleton";

/** Skeleton placeholder for a single ProductCard */
export const ProductCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215]">
    <Skeleton className="aspect-4/3 w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

/** Skeleton grid for loading states */
export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/** Skeleton for product detail page */
export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <Skeleton className="aspect-square w-full rounded-xl" />
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
    </div>
  </div>
);
