"use client";

import { Download } from "lucide-react";
import { CONTACT_LINKS } from "@/configs/contact";

/**
 * Vertical flag badge pinned to the right edge of the screen on desktop viewports.
 */
export default function CatalogueFlag() {
  return (
    <a
      href={CONTACT_LINKS.catalogueDrive}
      target="_blank"
      rel="noreferrer"
      aria-label="Download Catalogue"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex items-center justify-center rounded-l-2xl border-l-2 border-t border-b border-[#06B6A4]/70 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md px-3 py-4 text-xs font-bold text-slate-100 shadow-2xl shadow-black/30 hover:bg-[#06B6A4] hover:text-white hover:border-[#06B6A4] hover:-translate-x-1 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6A4] select-none"
    >
      <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180 tracking-wider text-[11px] font-semibold uppercase group-hover:font-bold transition-all">
        <Download className="h-4 w-4 shrink-0 text-[#06B6A4] group-hover:text-white rotate-90 group-hover:scale-110 transition-all duration-200" />
        <span>Download Catalogue</span>
      </div>
    </a>
  );
}
