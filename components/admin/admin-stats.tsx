"use client";

import React from "react";
import { Calendar, Grid, Tag } from "lucide-react";

interface AdminStatsProps {
  totalProducts: number;
  totalCategories: number;
  totalTags: number;
}

export default function AdminStats({
  totalProducts,
  totalCategories,
  totalTags,
}: AdminStatsProps) {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="p-4 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Products</p>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mt-1">
            {totalProducts}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="p-4 rounded-xl bg-[#2AA8BE]/10 text-[#2AA8BE] border border-[#2AA8BE]/20">
          <Grid className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">
            Unique Categories
          </p>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mt-1">
            {totalCategories}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex items-center gap-5">
        <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <Tag className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Featured tags</p>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] mt-1">
            {totalTags}
          </h2>
        </div>
      </div>
    </section>
  );
}
