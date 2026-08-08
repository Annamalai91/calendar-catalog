"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@lib/utils";
import { toSlug } from "@lib/utils/slug";
import type { ProductFilterProps } from "./type";
import { APP_TEXT } from "@configs/constants";

/**
 * ProductFilter — sidebar category selector for the catalog page.
 *
 * Grouped category cards with subcategory choices.
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

  const setCategoryAndSub = useCallback(
    (nextCategory: string, nextSubCategory: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("category", nextCategory);
      params.set("sub", nextSubCategory);
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const sectionClassName =
    "rounded-lg border border-black/8 dark:border-white/10 bg-white dark:bg-[#121215] p-3.5 sm:p-4";
  const sectionTitleClassName =
    "text-[15px] font-semibold leading-[18px] text-slate-900 dark:text-slate-100";
  const optionListClassName = "mt-3 flex flex-col gap-2";
  const optionRowClassName =
    "flex w-full items-center gap-3 rounded-md px-1 py-0.5 text-left text-sm text-slate-800 dark:text-slate-200 transition-colors hover:bg-[#F7FBF9] dark:hover:bg-[#1C1C21]";
  const checkboxClassName =
    "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border border-black/8 dark:border-white/20 bg-[#F7FCF9] dark:bg-[#1C1C21]";

  return (
    <aside
      aria-label={APP_TEXT.productFilter.ariaLabel}
      className="flex w-full flex-col gap-4 rounded-xl border border-black/8 dark:border-white/10 bg-white dark:bg-[#121215] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">
          {APP_TEXT.common.categories}
        </h2>
      </div>

      {categories.map((category) => {
        const isObj = typeof category === "object" && category !== null;
        const categoryName = isObj ? category.name : category;
        const categoryLabel = isObj ? category.label : category;
        const categorySlug = isObj ? category.slug : toSlug(categoryName);

        const categorySubCategories =
          subCategoriesByCategory[categorySlug] ?? [];
        const isCategoryActive = activeCategory === categorySlug;
        const firstSub = categorySubCategories[0];
        const firstSubSlug = firstSub
          ? typeof firstSub === "object" && firstSub !== null
            ? firstSub.slug
            : toSlug(firstSub)
          : undefined;

        return (
          <section key={categorySlug} className={sectionClassName}>
            <button
              type="button"
              onClick={() => {
                if (firstSubSlug) {
                  setCategoryAndSub(categorySlug, firstSubSlug);
                }
              }}
              className="w-full text-left"
            >
              <span
                className={cn(
                  sectionTitleClassName,
                  "block",
                  isCategoryActive && "text-primary font-bold",
                )}
              >
                {categoryLabel}
              </span>
            </button>
            <div className={optionListClassName}>
              {categorySubCategories.map((subCategory) => {
                const isSubObj =
                  typeof subCategory === "object" && subCategory !== null;
                const subName = isSubObj ? subCategory.name : subCategory;
                const subLabel = isSubObj ? subCategory.label : subCategory;
                const subSlug = isSubObj ? subCategory.slug : toSlug(subName);

                const isSubCategoryActive =
                  isCategoryActive && activeSubCategory === subSlug;

                return (
                  <button
                    key={subSlug}
                    type="button"
                    onClick={() => setCategoryAndSub(categorySlug, subSlug)}
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
