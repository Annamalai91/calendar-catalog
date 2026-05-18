"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@lib/utils";
import { toSlug } from "@lib/utils/slug";
import type { ProductFilterProps } from "./type";

/**
 * ProductFilter — sidebar filter for the catalog page.
 *
 * Figma source: "Aside" frame in Product Selection Container.
 * Uses grouped filter cards with checkbox-style rows.
 */
const ProductFilter = ({
  categories,
  subCategoriesByCategory,
  paperTypes,
  activeCategory,
  activeSubCategory,
  activePaperType,
}: ProductFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setCategoryAndSubFilter = useCallback(
    (nextCategory: string | undefined, nextSubCategory?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextCategory) {
        params.set("category", nextCategory);
      } else {
        params.delete("category");
      }

      if (nextSubCategory) {
        params.set("sub", nextSubCategory);
      } else {
        params.delete("sub");
      }

      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    !!activeCategory || !!activeSubCategory || !!activePaperType;

  const sectionClassName =
    "rounded-lg border border-black/8 bg-white p-3.5 sm:p-4";
  const sectionTitleClassName =
    "text-[15px] font-semibold leading-[18px] text-slate-900";
  const optionListClassName = "mt-3 flex flex-col gap-2";
  const optionRowClassName =
    "flex w-full items-center gap-3 rounded-md px-1 py-0.5 text-left text-sm text-slate-800 transition-colors hover:bg-[#F7FBF9]";
  const checkboxClassName =
    "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border border-black/8 bg-[#F7FCF9]";

  return (
    <aside
      aria-label="Product filters"
      className="flex w-full flex-col gap-4 rounded-xl border border-black/8 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-950">Filters</h2>
        {hasActiveFilters ? (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <button
        onClick={() => setCategoryAndSubFilter(undefined)}
        className={cn(
          optionRowClassName,
          "rounded-lg border border-black/8 px-3 py-2",
        )}
      >
        <span
          className={cn(
            checkboxClassName,
            !activeCategory && "border-primary/30 bg-primary/15 text-primary",
          )}
        >
          {!activeCategory ? <Check className="h-3 w-3" /> : null}
        </span>
        <span>All Products</span>
      </button>

      {categories.map((category) => {
        const categorySlug = toSlug(category);
        const categorySubCategories =
          subCategoriesByCategory[categorySlug] ?? [];
        const isCategoryActive = activeCategory === categorySlug;

        return (
          <section key={category} className={sectionClassName}>
            <h3 className={sectionTitleClassName}>{category}</h3>
            <div className={optionListClassName}>
              <button
                onClick={() =>
                  setCategoryAndSubFilter(
                    isCategoryActive && !activeSubCategory
                      ? undefined
                      : categorySlug,
                  )
                }
                className={optionRowClassName}
              >
                <span
                  className={cn(
                    checkboxClassName,
                    isCategoryActive &&
                      !activeSubCategory &&
                      "border-primary/30 bg-primary/15 text-primary",
                  )}
                >
                  {isCategoryActive && !activeSubCategory ? (
                    <Check className="h-3 w-3" />
                  ) : null}
                </span>
                <span>All</span>
              </button>

              {categorySubCategories.map((subCategory) => {
                const subSlug = toSlug(subCategory);
                const isSubCategoryActive =
                  isCategoryActive && activeSubCategory === subSlug;

                return (
                  <button
                    key={subCategory}
                    onClick={() =>
                      setCategoryAndSubFilter(
                        categorySlug,
                        isSubCategoryActive ? undefined : subSlug,
                      )
                    }
                    className={optionRowClassName}
                  >
                    <span
                      className={cn(
                        checkboxClassName,
                        isSubCategoryActive &&
                          "border-primary/30 bg-primary/15 text-primary",
                      )}
                    >
                      {isSubCategoryActive ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </span>
                    <span>{subCategory}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className={sectionClassName}>
        <h3 className={sectionTitleClassName}>Paper Type</h3>
        <div className={optionListClassName}>
          <button
            onClick={() => setFilter("paper", undefined)}
            className={optionRowClassName}
          >
            <span
              className={cn(
                checkboxClassName,
                !activePaperType &&
                  "border-primary/30 bg-primary/15 text-primary",
              )}
            >
              {!activePaperType ? <Check className="h-3 w-3" /> : null}
            </span>
            <span>All</span>
          </button>

          {paperTypes.map((type) => {
            const slug = toSlug(type);
            const isActive = activePaperType === slug;

            return (
              <button
                key={type}
                onClick={() => setFilter("paper", isActive ? undefined : slug)}
                className={optionRowClassName}
              >
                <span
                  className={cn(
                    checkboxClassName,
                    isActive && "border-primary/30 bg-primary/15 text-primary",
                  )}
                >
                  {isActive ? <Check className="h-3 w-3" /> : null}
                </span>
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default ProductFilter;
