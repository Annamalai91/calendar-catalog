"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@components/ui/dialog";
import type { ProductGalleryProps } from "./type";
import { APP_TEXT } from "@configs/constants";

/**
 * ProductGallery — main + secondary image viewer for product detail page.
 *
 * Figma source: product detail left panel
 * Client Component — handles active image state.
 */
const ProductGallery = ({
  coverImage,
  fullImage,
  alt,
}: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState<"main" | "secondary">("main");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const images = [
    {
      key: "main" as const,
      src: coverImage,
      label: APP_TEXT.productGallery.frontView,
    },
    {
      key: "secondary" as const,
      src: fullImage,
      label: APP_TEXT.productGallery.detailView,
    },
  ];

  const currentSrc = activeImage === "main" ? coverImage : fullImage;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        aria-label={`${APP_TEXT.productGallery.openPreviewPrefix} ${alt}`}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {activeImage === "main" ? (
          <Image
            src={coverImage}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
            className="object-contain p-4"
          />
        ) : (
          <Image
            src={fullImage}
            alt={alt}
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
            className="object-contain p-4"
          />
        )}
      </button>

      {/* Thumbnail strip */}
      <div
        className="flex gap-3"
        role="tablist"
        aria-label={APP_TEXT.productGallery.tabListAriaLabel}
      >
        {images.map(({ key, src, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeImage === key}
            aria-label={label}
            onClick={() => setActiveImage(key)}
            className={cn(
              "group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-white transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeImage === key
                ? "border-primary shadow-sm"
                : "border-border/60 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md",
            )}
          >
            <Image
              src={src}
              alt={label}
              fill
              sizes="80px"
              className="object-contain p-1 transition-transform duration-200 ease-out group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className="flex h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-none cursor-pointer items-center justify-center overflow-hidden bg-transparent p-2 shadow-none [&>button]:hidden"
          onClick={() => setIsPreviewOpen(false)}
        >
          <DialogTitle className="sr-only">
            {alt} {APP_TEXT.productGallery.imagePreviewSuffix}
          </DialogTitle>
          <div
            className="relative inline-flex cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentSrc}
              alt={alt}
              width={0}
              height={0}
              loading="eager"
              sizes="calc(100vw - 1rem)"
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "calc(100vw - 1rem)",
                maxHeight: "calc(100vh - 1rem)",
              }}
            />
            <DialogClose className="absolute right-2 -top-12 sm:-right-12 sm:top-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/90 text-slate-700 shadow-sm transition duration-200 hover:scale-105 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">{APP_TEXT.productGallery.close}</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
