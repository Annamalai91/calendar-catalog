"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@lib/utils";
import { toSlug } from "@lib/utils/slug";
import type { ProductFilterProps } from "./type";
import { APP_TEXT } from "@configs/constants";

/**
 * ProductFilter — sidebar filter for the catalog page.
 *
 * Figma source: "Aside" frame in Product Selection Container.
 * Uses grouped filter cards with checkbox-style rows.
 */
const ProductFilter = ({
  categories,
  subCategoriesByCategory,
  activeCategory,
  activeSubCategory,
}: ProductFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


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
    !!activeCategory || !!activeSubCategory;

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
      aria-label={APP_TEXT.productFilter.ariaLabel}
      className="flex w-full flex-col gap-4 rounded-xl border border-black/8 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-950">
          {APP_TEXT.common.filters}
        </h2>
        {hasActiveFilters ? (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            {APP_TEXT.common.clearAll}
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
        <span>{APP_TEXT.common.allProducts}</span>
      </button>

      {categories.map((category) => {
        const isObj = typeof category === "object" && category !== null;
        const categoryName = isObj ? category.name : category;
        const categoryLabel = isObj ? category.label : category;
        const categorySlug = isObj ? category.slug : toSlug(categoryName);

        const categorySubCategories =
          subCategoriesByCategory[categorySlug] ?? [];
        const isCategoryActive = activeCategory === categorySlug;

        return (
          <section key={categorySlug} className={sectionClassName}>
            <h3 className={sectionTitleClassName}>{categoryLabel}</h3>
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
                <span>{APP_TEXT.common.all}</span>
              </button>

              {categorySubCategories.map((subCategory) => {
                const isSubObj = typeof subCategory === "object" && subCategory !== null;
                const subName = isSubObj ? subCategory.name : subCategory;
                const subLabel = isSubObj ? subCategory.label : subCategory;
                const subSlug = isSubObj ? subCategory.slug : toSlug(subName);

                const isSubCategoryActive =
                  isCategoryActive && activeSubCategory === subSlug;

                return (
                  <button
                    key={subSlug}
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
                    <span>{subLabel}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}



    </aside>
  );
};

export default ProductFilter;
