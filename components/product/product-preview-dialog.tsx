"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "@components/ui/dialog";
import type { Product } from "@shared/types/product";
import { APP_TEXT } from "@configs/constants";

export interface ProductPreviewDialogProps {
  open: boolean;
  products: Product[];
  index: number;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: (index: number) => void;
}

const ProductPreviewDialog = ({
  open,
  products,
  index,
  onOpenChange,
  onPrevious,
  onNext,
  onNavigate,
}: ProductPreviewDialogProps) => {
  const product = products[index];
  const [detailsOpenIndex, setDetailsOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrevious();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onPrevious, onNext]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[calc(100vh-1rem)] w-screen max-w-none flex-col overflow-hidden rounded-none border-0 bg-transparent shadow-none backdrop-blur-xl [&>button]:hidden">
        {product ? (
          <>
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black/40 p-2 sm:p-3">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%),linear-gradient(135deg,rgba(0,0,0,0.2),transparent_70%)]" />

              <div className="relative z-10 flex h-full w-full max-w-[min(95vw,1400px)] flex-col gap-4 lg:flex-row">
                {/* Image area */}
                <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image
                      src={product.cover_image || product.full_image}
                      alt={product.name}
                      width={1200}
                      height={1800}
                      loading="eager"
                      sizes="(max-width: 1024px) 95vw, 70vw"
                      className="h-full w-auto max-w-full object-contain"
                    />

                    <button
                      type="button"
                      onClick={onPrevious}
                      aria-label={APP_TEXT.productPreview.previousDesignAria}
                      className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-[#F7FBF9] dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md transition-transform hover:scale-105 hover:bg-[#EEF4F0] dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:left-4"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={onNext}
                      aria-label={APP_TEXT.productPreview.nextDesignAria}
                      className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-[#F7FBF9] dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md transition-transform hover:scale-105 hover:bg-[#EEF4F0] dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:right-4"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {products.map((item, itemIndex) => (
                      <button
                        key={item.slug ?? item.name}
                        type="button"
                        aria-label={`${APP_TEXT.productPreview.showPrefix} ${item.name}`}
                        aria-current={itemIndex === index}
                        onClick={() => onNavigate(itemIndex)}
                        className={
                          itemIndex === index
                            ? "h-2.5 w-8 rounded-full bg-[#0F766E] dark:bg-[#2dd4bf]"
                            : "h-2.5 w-2.5 rounded-full bg-white/40 dark:bg-white/30 transition-colors hover:bg-white/60"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Details panel — accordion on mobile, always visible on lg+ */}
                <div className="w-full shrink-0 rounded-2xl bg-[#F7FBF9] dark:bg-[#121215] lg:flex lg:w-72 lg:flex-col lg:justify-center xl:w-80 border border-slate-200/80 dark:border-white/10 shadow-2xl">
                  {/* Mobile toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setDetailsOpenIndex((currentIndex) =>
                        currentIndex === index ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-slate-900 dark:text-white lg:hidden"
                  >
                    <span>{APP_TEXT.productPreview.mobileViewDetails}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${detailsOpenIndex === index ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Content */}
                  <div
                    className={`flex flex-col gap-4 p-6 pt-2 lg:pt-6 ${detailsOpenIndex === index ? "flex" : "hidden lg:flex"}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#2dd4bf]">
                        {APP_TEXT.productPreview.nameLabel}
                      </span>
                      <span className="text-base font-semibold leading-snug text-slate-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>

                    {product.main_category && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#2dd4bf]">
                          {APP_TEXT.productPreview.categoryLabel}
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {product.main_category}
                        </span>
                      </div>
                    )}

                    {product.size && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#2dd4bf]">
                          {APP_TEXT.productPreview.sizeLabel}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {product.size}
                        </span>
                      </div>
                    )}

                    {product.paper_type && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#2dd4bf]">
                          {APP_TEXT.productPreview.paperTypeLabel}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {product.paper_type}
                        </span>
                      </div>
                    )}

                    {product.advt_space && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E] dark:text-[#2dd4bf]">
                          {APP_TEXT.productPreview.advtSpaceLabel}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {product.advt_space}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <DialogClose
                  aria-label={APP_TEXT.productPreview.closePreviewAria}
                  className="absolute right-2 top-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-[#F7FBF9] dark:bg-slate-800 text-slate-700 dark:text-slate-100 shadow-sm transition duration-200 hover:scale-105 hover:bg-[#EEF4F0] dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:right-4 sm:top-4"
                >
                  <span className="text-lg leading-none">x</span>
                </DialogClose>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;
