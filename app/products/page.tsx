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
import { APP_TEXT } from "@configs/constants";
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
  const activeQueryLabel = params.q?.trim() ? params.q.trim() : undefined;
  type SelectedFilter = { key: string; label: string; value: string };
  const selectedFilters: SelectedFilter[] = [];
  if (activeCategoryLabel) {
    selectedFilters.push({
      key: "category",
      label: APP_TEXT.productsPage.selectedFilterLabels.category,
      value: activeCategoryLabel,
    });
  }
  if (activeSubCategoryLabel) {
    selectedFilters.push({
      key: "size",
      label: APP_TEXT.productsPage.selectedFilterLabels.size,
      value: activeSubCategoryLabel,
    });
  }
  if (activeQueryLabel) {
    selectedFilters.push({
      key: "search",
      label: APP_TEXT.productsPage.selectedFilterLabels.search,
      value: activeQueryLabel,
    });
  }

  // Extract metadata lists from displayed products for the banner
  const mainCat = [...new Set(filteredProducts.map((p) => p.main_category))].join(", ");
  const subCategoriesList = [...new Set(filteredProducts.map((p) => p.sub_category))];
  const advtSpacesList = [...new Set(filteredProducts.map((p) => p.advt_space).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#F7FBF9]">
      <div className="mx-auto max-w-360 px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden w-68 shrink-0 lg:block">
            <Suspense fallback={null}>
              <ProductFilter
                categories={categories}
                subCategoriesByCategory={subCategoriesByCategory}
                activeCategory={params.category}
                activeSubCategory={params.sub}
              />
            </Suspense>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-7">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {APP_TEXT.productsPage.catalogLabel}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    {activeCategoryLabel ?? APP_TEXT.common.allProducts}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? APP_TEXT.productsPage.productSingular
                      : APP_TEXT.productsPage.productPlural}
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
                    {APP_TEXT.productsPage.mobileFiltersButton}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#F7FBF9] p-0 flex flex-col h-full gap-0">
                  <SheetHeader className="border-b border-black/8 px-5 py-4">
                    <SheetTitle>
                      {APP_TEXT.productsPage.mobileFiltersTitle}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-5">
                    <ProductFilter
                      categories={categories}
                      subCategoriesByCategory={subCategoriesByCategory}
                      activeCategory={params.category}
                      activeSubCategory={params.sub}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </section>

            {/* Category Banner Placeholder */}
            {params.category && (
              <div className="relative overflow-hidden rounded-xl bg-sage-700 text-white p-3 shadow-sm border border-sage-800 mb-3 transition-all duration-300">

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2.5 gap-x-6 text-xs text-white">
                  {/* Main Category (Left) */}
                  <div className="flex items-center gap-2 sm:w-1/3 sm:justify-start">
                    <span className="text-[10px] uppercase tracking-wider text-sage-200 font-bold">Category</span>
                    <span className="font-semibold bg-white/10 px-2 py-0.5 rounded-md border border-white/10 text-white">
                      {mainCat}
                    </span>
                  </div>

                  {/* Advt. Spaces (Center) */}
                  <div className="flex items-center gap-2 sm:w-1/3 sm:justify-center">
                    {advtSpacesList.length > 0 && (
                      <>
                        <span className="text-[10px] uppercase tracking-wider text-sage-200 font-bold">Advertisement Space</span>
                        <div className="flex flex-wrap items-center gap-1">
                          {advtSpacesList.map((space) => (
                            <span key={space} className="bg-white/10 px-2 py-0.5 rounded-md border border-white/10 text-[11px] font-medium text-white shadow-sm">
                              {space}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sub Categories (Right) */}
                  <div className="flex items-center gap-2 sm:w-1/3 sm:justify-end">
                    <span className="text-[10px] uppercase tracking-wider text-sage-200 font-bold">Types</span>
                    <div className="flex flex-wrap items-center gap-1">
                      {subCategoriesList.map((sub) => (
                        <span key={sub} className="bg-white/10 px-2 py-0.5 rounded-md border border-white/10 text-[11px] font-medium text-white shadow-sm">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Suspense fallback={<ProductGridSkeleton count={6} />}>
              <ProductGrid products={filteredProducts} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
