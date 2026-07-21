"use client";

import React from "react";
import { Search, Plus } from "lucide-react";

interface AdminToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  categories: string[];
  onOpenAddModal: () => void;
}

export default function AdminToolbar({
  searchQuery,
  setSearchQuery,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  categories,
  onOpenAddModal,
}: AdminToolbarProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-border/60 shadow-sm">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search calendars by name, category, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-[#F7FBF9] pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-primary/50"
          />
        </div>
        {/* Category Filter */}
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary/50 min-w-[200px]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onOpenAddModal}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Add Calendar</span>
      </button>
    </section>
  );
}
