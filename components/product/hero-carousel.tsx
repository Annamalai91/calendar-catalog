"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@lib/utils";
import { toSlug } from "@lib/utils/slug";
import type { Product } from "@shared/types/product";

interface HeroCarouselProps {
  products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 2000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPaused, nextSlide]);

  if (!products || products.length === 0) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-4xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider view container - transparent, borderless, shadowless */}
      <div className="overflow-hidden relative aspect-536/392 sm:aspect-[4/3] md:aspect-[16/11] w-full bg-transparent">
        {products.map((product, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={product.name + product.main_category}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-between p-4 bg-transparent",
                isActive
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              <Link
                href={`/products?category=${toSlug(product.main_category)}`}
                className="relative w-full h-full flex flex-col items-center justify-between group/slide"
              >
                {/* Image Showcase */}
                <div className="relative w-full flex-1 flex items-center justify-center transition-transform duration-500 group-hover/slide:scale-[1.02]">
                  <div className="relative w-full h-full max-h-[80%]">
                    <Image
                      src={product.cover_image || product.full_image}
                      alt={`${product.main_category} — ${product.name}`}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-contain select-none"
                    />
                  </div>
                </div>

                {/* Minimal High-Contrast Info Block */}
                <div className="mt-6 flex flex-col items-center text-center pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#115e59] flex items-center gap-1.5 transition-colors group-hover/slide:text-[#0f766e]">
                    {product.main_category}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover/slide:opacity-100 group-hover/slide:translate-x-0" />
                  </span>
                  <span className="mt-1.5 text-base sm:text-lg font-extrabold text-[#0f172a] tracking-tight">
                    Model {product.name}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Nav Chevrons (Glassmorphic design with high-contrast icons) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border/60 bg-white/90 text-slate-900 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#06B6A4] focus:ring-offset-2"
      >
        <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border/60 bg-white/90 text-slate-900 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#06B6A4] focus:ring-offset-2"
      >
        <ChevronRight className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Progress dots (placed below with safe contrast) */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none",
              idx === currentIndex
                ? "w-6 bg-[#06B6A4]"
                : "w-2 bg-slate-300 hover:bg-slate-400 focus:bg-slate-400"
            )}
          />
        ))}
      </div>
    </div>
  );
}
