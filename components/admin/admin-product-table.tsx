"use client";

import React from "react";
import { Edit3, Trash2, Search, Loader2, Package, Image as ImageIcon } from "lucide-react";

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  main_category: string;
  sub_category: string;
  advt_space: string;
  size: string;
  paper_type: string;
  cover_image: string;
  full_image: string;
  tag: string;
  meta_title: string;
  meta_description: string;
}

interface AdminProductTableProps {
  isLoading: boolean;
  products: AdminProduct[];
  filteredCount: number;
  paginatedProducts: AdminProduct[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number | "all";
  startItem: number;
  endItem: number;
  onPageChange: (newPage: number) => void;
  onItemsPerPageChange: (newVal: number | "all") => void;
  onEditProduct: (prod: AdminProduct) => void;
  onDeleteProduct: (prod: AdminProduct) => void;
}

export default function AdminProductTable({
  isLoading,
  products,
  filteredCount,
  paginatedProducts,
  currentPage,
  totalPages,
  itemsPerPage,
  startItem,
  endItem,
  onPageChange,
  onItemsPerPageChange,
  onEditProduct,
  onDeleteProduct,
}: AdminProductTableProps) {
  return (
    <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215] shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-slate-50/50 dark:bg-[#18181B]/50">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading catalog records...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-50/50 dark:bg-[#18181B]/50">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Calendars Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            No products match your search criteria or category filter. Try clearing filters or add a new calendar design.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border dark:border-white/10 bg-[#F7FBF9]/80 dark:bg-[#18181B]/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Design</th>
                  <th className="px-6 py-4">Main Category</th>
                  <th className="px-6 py-4">Subcategory</th>
                  <th className="px-6 py-4">Advt Space</th>
                  <th className="px-6 py-4">Paper Type</th>
                  <th className="px-6 py-4">Tag</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-white/10 text-sm">
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-[#18181B]/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 rounded-lg bg-[#F7FBF9] dark:bg-[#18181B] border border-border dark:border-white/10 overflow-hidden">
                          {product.cover_image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={product.cover_image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{product.name}</div>
                          {product.size && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">Size: {product.size}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {product.main_category}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {product.sub_category}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {product.advt_space || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {product.paper_type || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {product.tag ? (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                          {product.tag}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product)}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="border-t border-border/60 dark:border-white/10 bg-[#F7FBF9]/30 dark:bg-[#18181B]/30 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {startItem}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredCount}</span>{" "}
              calendars
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value;
                  onItemsPerPageChange(val === "all" ? "all" : Number(val));
                }}
                className="rounded-lg border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-primary/50"
              >
                <option value={50}>50 per page</option>
                <option value="all">Show all</option>
              </select>
            </div>

            {/* Right: Prev/Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || itemsPerPage === "all"}
                className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                Previous
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || itemsPerPage === "all"}
                className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
