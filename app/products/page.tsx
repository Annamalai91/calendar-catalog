import { SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";
import ProductGrid from "@components/product/product-grid";
import ProductFilter from "@components/product/product-filter";
import { ProductGridSkeleton } from "@components/product/product-skeleton";
import { Button } from "@components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { getAllProducts, getAllCategories } from "@data/products";
import { toSlug, fromSlug } from "@lib/utils/slug";
import type { PageProps } from "@shared/types/common";
import type { ProductsPageSearchParams } from "./type";
import { productsMetadata } from "@configs/metadata";
export { productsMetadata as metadata };

/**
 * Product Selection page — "/products"
 *
 * Figma source: "Product Selection" frame
 *   - Header (64px) + Container: Aside (fixed width) + Main (flex-grow)
 *   - Container padding: 32px, itemSpacing: 32px
 *   - Aside: VERTICAL, FIXED width, FILL height
 *   - Main: VERTICAL, FILL, itemSpacing: 28px
 *
 * Server Component — filter state driven by URL search params.
 */
export default async function ProductsPage({
  searchParams,
}: PageProps<Record<string, never>>) {
  const params = (await searchParams) as ProductsPageSearchParams;

  const allProducts = getAllProducts();
  const categories = getAllCategories();
  const paperTypes = [...new Set(allProducts.map((p) => p.paper_type))];
  const subCategoriesByCategory = categories.reduce<Record<string, string[]>>(
    (acc, category) => {
      const categorySlug = toSlug(category);
      acc[categorySlug] = [
        ...new Set(
          allProducts
            .filter((product) => product.main_category === category)
            .map((product) => product.size ?? product.sub_category),
        ),
      ];
      return acc;
    },
    {},
  );

  // Apply filters
  const filteredProducts = allProducts.filter((product) => {
    if (params.category && toSlug(product.main_category) !== params.category) {
      return false;
    }
    if (
      params.sub &&
      toSlug(product.size ?? product.sub_category) !== params.sub
    ) {
      return false;
    }
    if (params.paper && toSlug(product.paper_type) !== params.paper) {
      return false;
    }
    if (params.q) {
      const query = params.q.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.main_category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const activeCategoryLabel = params.category
    ? fromSlug(params.category)
    : undefined;
  const activeSubCategoryLabel = params.sub ? fromSlug(params.sub) : undefined;
  const activePaperTypeLabel = params.paper
    ? fromSlug(params.paper)
    : undefined;
  const activeQueryLabel = params.q?.trim() ? params.q.trim() : undefined;
  const selectedFilters = [
    activeCategoryLabel
      ? { key: "category", label: "Category", value: activeCategoryLabel }
      : null,
    activeSubCategoryLabel
      ? {
          key: "size",
          label: "Size",
          value: activeSubCategoryLabel,
        }
      : null,
    activePaperTypeLabel
      ? { key: "paper", label: "Paper", value: activePaperTypeLabel }
      : null,
    activeQueryLabel
      ? { key: "search", label: "Search", value: activeQueryLabel }
      : null,
  ].filter(
    (item): item is { key: string; label: string; value: string } =>
      item !== null,
  );

  return (
    <div className="min-h-screen bg-[#F7FBF9]">
      <div className="mx-auto max-w-360 px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden w-68 shrink-0 lg:block">
            <Suspense fallback={null}>
              <ProductFilter
                categories={categories}
                subCategoriesByCategory={subCategoriesByCategory}
                paperTypes={paperTypes}
                activeCategory={params.category}
                activeSubCategory={params.sub}
                activePaperType={params.paper}
              />
            </Suspense>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-7">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Catalog
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    {activeCategoryLabel ?? "All Products"}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                  </p>
                </div>
                {selectedFilters.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedFilters.map((filter) => (
                      <span
                        key={filter.key}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {filter.label}: {filter.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-black/10 bg-white px-4 text-sm lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#F7FBF9] p-0">
                  <SheetHeader className="border-b border-black/8 px-5 py-4">
                    <SheetTitle>Product Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-5">
                    <ProductFilter
                      categories={categories}
                      subCategoriesByCategory={subCategoriesByCategory}
                      paperTypes={paperTypes}
                      activeCategory={params.category}
                      activeSubCategory={params.sub}
                      activePaperType={params.paper}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </section>

            <Suspense fallback={<ProductGridSkeleton count={6} />}>
              <ProductGrid products={filteredProducts} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
