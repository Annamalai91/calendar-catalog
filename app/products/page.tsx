import { SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
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
import { getCachedAllProducts, getCachedFormattedCategories, getCachedFormattedSubCategoriesByCategory } from "@data/products";
import { toSlug, fromSlug } from "@lib/utils/slug";
import type { PageProps } from "@shared/types/common";
import type { ProductsPageSearchParams } from "./type";
import { productsMetadata } from "@configs/metadata";
import { APP_TEXT } from "@configs/constants";
export { productsMetadata as metadata };

/**
 * Product Selection page — "/products"
 *
 * Server Component — filter state driven by URL search params.
 * Enforces that at least one main and one sub category are always selected by default.
 */
export default async function ProductsPage({
  searchParams,
}: PageProps<Record<string, never>>) {
  const params = (await searchParams) as ProductsPageSearchParams;

  // Run all 3 queries in parallel instead of sequentially
  const [allProducts, categories, subCategoriesByCategory] = await Promise.all([
    getCachedAllProducts(),
    getCachedFormattedCategories(),
    getCachedFormattedSubCategoriesByCategory(),
  ]);

  const validCategory =
    categories.find((c) => c.slug === params.category)?.slug ?? categories[0]?.slug;
  const availableSubCategories = validCategory
    ? (subCategoriesByCategory[validCategory] ?? [])
    : [];
  const validSubCategory =
    availableSubCategories.find((s) => s.slug === params.sub)?.slug ??
    availableSubCategories[0]?.slug;

  if (
    (validCategory && params.category !== validCategory) ||
    (validSubCategory && params.sub !== validSubCategory)
  ) {
    const urlParams = new URLSearchParams();
    if (validCategory) urlParams.set("category", validCategory);
    if (validSubCategory) urlParams.set("sub", validSubCategory);
    if (params.q) urlParams.set("q", params.q);
    redirect(`/products?${urlParams.toString()}`);
  }

  // Filter products by category, subcategory, and optional search query
  const filteredProducts = allProducts.filter((product) => {
    if (validCategory && toSlug(product.main_category) !== validCategory) {
      return false;
    }
    if (
      validSubCategory &&
      toSlug(product.sub_category) !== validSubCategory &&
      toSlug(product.size ?? "") !== validSubCategory
    ) {
      return false;
    }

    if (params.q) {
      const query = params.q.toLowerCase();
      return (
        (product.name || "").toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        (product.main_category || "").toLowerCase().includes(query)
      );
    }

    return true;
  });

  const activeCategoryLabel = validCategory ? fromSlug(validCategory) : undefined;
  const activeSubCategoryLabel = validSubCategory ? fromSlug(validSubCategory) : undefined;
  const activeQueryLabel = params.q?.trim() ? params.q.trim() : undefined;

  type SelectedCategory = { key: string; label: string; value: string };
  const selectedCategories: SelectedCategory[] = [];
  if (activeCategoryLabel) {
    selectedCategories.push({
      key: "category",
      label: APP_TEXT.productsPage.selectedCategoryLabels.category,
      value: activeCategoryLabel,
    });
  }
  if (activeSubCategoryLabel) {
    selectedCategories.push({
      key: "size",
      label: APP_TEXT.productsPage.selectedCategoryLabels.size,
      value: activeSubCategoryLabel,
    });
  }
  if (activeQueryLabel) {
    selectedCategories.push({
      key: "search",
      label: APP_TEXT.productsPage.selectedCategoryLabels.search,
      value: activeQueryLabel,
    });
  }

  // Extract metadata lists from displayed products for the banner
  const mainCat = [...new Set(filteredProducts.map((p) => p.main_category))].join(", ");
  const subCategoriesList = [...new Set(filteredProducts.map((p) => p.sub_category))];
  const advtSpacesList = [...new Set(filteredProducts.map((p) => p.advt_space).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#F7FBF9] dark:bg-[#0A0A0C] transition-colors">
      <div className="mx-auto max-w-360 px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden w-68 shrink-0 lg:block">
            <Suspense fallback={null}>
              <ProductFilter
                categories={categories}
                subCategoriesByCategory={subCategoriesByCategory}
                activeCategory={validCategory}
                activeSubCategory={validSubCategory}
              />
            </Suspense>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-7">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {APP_TEXT.productsPage.catalogLabel}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950 dark:text-slate-100">
                    {activeCategoryLabel}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? APP_TEXT.productsPage.productSingular
                      : APP_TEXT.productsPage.productPlural}
                  </p>
                </div>
                {selectedCategories.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedCategories.map((item) => (
                      <span
                        key={item.key}
                        className="rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                      >
                        {item.label}: {item.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-black/10 dark:border-white/15 bg-white dark:bg-slate-800 px-4 text-sm lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {APP_TEXT.productsPage.mobileCategoriesButton}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#F7FBF9] dark:bg-[#0A0A0C] p-0 flex flex-col h-full gap-0 dark:border-white/10">
                  <SheetHeader className="border-b border-black/8 dark:border-white/10 px-5 py-4">
                    <SheetTitle>
                      {APP_TEXT.productsPage.mobileCategoriesTitle}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-5">
                    <ProductFilter
                      categories={categories}
                      subCategoriesByCategory={subCategoriesByCategory}
                      activeCategory={validCategory}
                      activeSubCategory={validSubCategory}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </section>

            {/* Category Banner */}
            {validCategory && (
              <div className="relative overflow-hidden rounded-xl bg-sage-700 dark:bg-[#18181B] text-white p-3 shadow-sm border border-sage-800 dark:border-[#27272A] mb-3 transition-all duration-300">
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2.5 gap-x-6 text-xs text-white">
                  {/* Main Category (Left) */}
                  <div className="flex items-center gap-2 sm:w-1/3 sm:justify-start">
                    <span className="text-[10px] uppercase tracking-wider text-sage-200 dark:text-sage-300 font-bold">Category</span>
                    <span className="font-semibold bg-white/10 dark:bg-white/15 px-2 py-0.5 rounded-md border border-white/10 text-white">
                      {mainCat || activeCategoryLabel}
                    </span>
                  </div>

                  {/* Advt. Spaces (Center) */}
                  <div className="flex items-center gap-2 sm:w-1/3 sm:justify-center">
                    {advtSpacesList.length > 0 && (
                      <>
                        <span className="text-[10px] uppercase tracking-wider text-sage-200 dark:text-sage-300 font-bold">Advertisement Space</span>
                        <div className="flex flex-wrap items-center gap-1">
                          {advtSpacesList.map((space) => (
                            <span key={space} className="bg-white/10 dark:bg-white/15 px-2 py-0.5 rounded-md border border-white/10 text-[11px] font-medium text-white shadow-sm">
                              {space}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sub Categories (Right) */}
                  <div className="flex items-center gap-2 sm:w-1/3 sm:justify-end">
                    <span className="text-[10px] uppercase tracking-wider text-sage-200 dark:text-sage-300 font-bold">Types</span>
                    <div className="flex flex-wrap items-center gap-1">
                      {subCategoriesList.map((sub) => (
                        <span key={sub} className="bg-white/10 dark:bg-white/15 px-2 py-0.5 rounded-md border border-white/10 text-[11px] font-medium text-white shadow-sm">
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
