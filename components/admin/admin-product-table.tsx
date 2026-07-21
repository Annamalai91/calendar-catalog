"use client";

import React from "react";
import { Edit3, Trash2, Search, Loader2 } from "lucide-react";

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
    <section className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-slate-50/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-slate-500 text-sm">Syncing with database...</p>
        </div>
      ) : filteredCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-50/50">
          <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-border/50">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            No products found
          </h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Try adjusting your search queries or category filters, or add a brand new calendar template.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-[#F7FBF9]/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category & Size</th>
                <th className="px-6 py-4">Advt Space</th>
                <th className="px-6 py-4">Paper & Tag</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-12 shrink-0 rounded-lg bg-[#F7FBF9] border border-border overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.cover_image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block text-sm">
                          {product.name}
                        </span>
                        <span className="text-xs text-slate-500 block max-w-[200px] truncate mt-1">
                          {product.description || "No description"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-slate-700 block font-medium">
                      {product.main_category}
                    </span>
                    <span className="text-slate-500 block text-xs mt-1">
                      {product.size || product.sub_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {product.advt_space || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-slate-600 block">
                      {product.paper_type || "—"}
                    </span>
                    {product.tag && (
                      <span className="inline-block rounded-md bg-[#EAF5EF] px-2 py-0.5 text-xs font-semibold text-[#2D6A47] mt-1.5 border border-[#D0EBD9]">
                        {product.tag}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product)}
                        className="p-2 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="border-t border-border/60 bg-[#F7FBF9]/30 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value;
                  onItemsPerPageChange(val === "all" ? "all" : Number(val));
                }}
                className="rounded-lg border border-border bg-[#F7FBF9] px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/50"
              >
                <option value={50}>50 per page</option>
                <option value="all">Show all</option>
              </select>
            </div>

            {/* Center: Info text */}
            <span className="text-xs text-slate-500 font-medium">
              Showing {startItem}–{endItem} of {filteredCount} entries
            </span>

            {/* Right: Prev/Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || itemsPerPage === "all"}
                className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                Previous
              </button>

              <span className="text-xs text-slate-500 font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || itemsPerPage === "all"}
                className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
