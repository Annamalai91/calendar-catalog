"use client";

import React from "react";
import { FolderPlus, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onOpenCategoryManager: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  onOpenCategoryManager,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="border-b border-border/60 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/90 sticky top-[64px] z-30 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
            CC
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A] dark:text-slate-100 leading-none">
              Catalog Admin
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Calendar Catalog Control Panel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCategoryManager}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition cursor-pointer"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-accent dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
