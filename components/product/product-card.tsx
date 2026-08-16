"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { getPaperBadgeClassName, sizeBadgeClassName } from "./badge-styles";
import { cn } from "@lib/utils";
import { toSlug } from "@lib/utils/slug";
import type { ProductCardProps } from "./type";
import { APP_TEXT } from "@configs/constants";

/**
 * ProductCard — displays a single product in grid/list views.
 *
 * Client Component — preview clicks are handled by the parent grid.
 */
const ProductCard = ({ product, className, onPreview, priority }: ProductCardProps) => {
  const slug = product.slug ?? toSlug(product.name);

  return (
    <article className="h-full">
      <Card
        className={cn(
          "group flex flex-col h-full overflow-hidden rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215] p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01]",
          className,
        )}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={`${APP_TEXT.productCard.previewAriaPrefix} ${product.name}`}
          onClick={() => {
            onPreview?.(product);
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && onPreview) {
              event.preventDefault();
              onPreview(product);
            }
          }}
          className="flex flex-col flex-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* Framed Image Container */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-[#1C1C21] border border-border/30 dark:border-white/10 p-2.5">
            <Image
              src={product.cover_image || product.full_image}
              alt={`${product.name} — ${product.main_category}`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain select-none transition-transform duration-300 group-hover:scale-[1.04]"
              placeholder="empty"
            />
            {product.tag ? (
              <div className="absolute left-2.5 top-2.5">
                <Badge variant="success" className="text-xs font-semibold shadow-xs">
                  {product.tag}
                </Badge>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-col flex-1 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#115e59] dark:text-[#5eead4]">
              {product.main_category}
            </p>

            <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 dark:text-slate-100 transition-colors group-hover:text-[#06B6A4] dark:group-hover:text-[#2dd4bf]">
              {product.name}
            </h3>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className={`${sizeBadgeClassName} text-xs`}>
                {product.size ?? product.sub_category}
              </Badge>
              <Badge
                className={`${getPaperBadgeClassName(product.paper_type)} text-xs`}
              >
                {product.paper_type} {APP_TEXT.productCard.paperSuffix}
              </Badge>
            </div>

            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {product.description}
            </p>

            <div className="mt-auto pt-2">
              <Button
                asChild
                className="h-10 w-full rounded-xl border border-transparent bg-[#06B6A4] px-4 py-2.5 text-sm font-semibold text-white shadow-none transition-all hover:bg-[#08998B]"
              >
                <Link
                  href={`/products/${slug}`}
                  aria-label={`${APP_TEXT.productCard.viewDetailsAriaPrefix} ${product.name}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  {APP_TEXT.productCard.viewDetails}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </article>
  );
};

export default ProductCard;
