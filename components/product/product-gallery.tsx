"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import type { ProductGalleryProps } from "./type";

/**
 * ProductGallery — main + secondary image viewer for product detail page.
 *
 * Figma source: product detail left panel
 * Client Component — handles active image state.
 */
const ProductGallery = ({
  mainImage,
  secondaryImage,
  alt,
}: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState<"main" | "secondary">("main");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const images = [
    { key: "main" as const, src: mainImage, label: "Front view" },
    { key: "secondary" as const, src: secondaryImage, label: "Detail view" },
  ];

  const currentSrc = activeImage === "main" ? mainImage : secondaryImage;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        aria-label={`Open image preview for ${alt}`}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Image
          src={currentSrc}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
          className="object-contain p-4"
        />
      </button>

      {/* Thumbnail strip */}
      <div className="flex gap-3" role="tablist" aria-label="Product images">
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
        <DialogContent className="max-w-5xl overflow-hidden bg-white p-2 sm:p-4">
          <DialogTitle className="sr-only">{alt} image preview</DialogTitle>
          <div className="relative aspect-4/3 w-full sm:aspect-16/10">
            <Image
              src={currentSrc}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 95vw, 80vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
