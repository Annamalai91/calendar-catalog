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

/**
 * ProductCard — displays a single product in grid/list views.
 *
 * Client Component — preview clicks are handled by the parent grid.
 */
const ProductCard = ({ product, className, onPreview }: ProductCardProps) => {
  const slug = product.slug ?? toSlug(product.name);

  return (
    <article>
      <Card
        className={cn(
          "group h-full overflow-hidden border-border/60 bg-white transition-shadow hover:shadow-md",
          className,
        )}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={`Preview ${product.name}`}
          onClick={() => {
            onPreview?.(product);
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && onPreview) {
              event.preventDefault();
              onPreview(product);
            }
          }}
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="relative aspect-5/4 w-full overflow-hidden bg-muted/40">
            <Image
              src={product.secondary_image || product.image}
              alt={`${product.name} — ${product.main_category}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
              placeholder="empty"
            />
            {product.tag ? (
              <div className="absolute left-3 top-3">
                <Badge variant="success" className="text-xs font-semibold">
                  {product.tag}
                </Badge>
              </div>
            ) : null}
          </div>

          <CardContent className="space-y-2.5 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.main_category}
            </p>

            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${sizeBadgeClassName} text-xs`}>
                {product.size ?? product.sub_category}
              </Badge>
              <Badge
                className={`${getPaperBadgeClassName(product.paper_type)} text-xs`}
              >
                {product.paper_type} Paper
              </Badge>
            </div>

            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="pt-1">
              <Button
                asChild
                className="h-9.75 w-full rounded-lg border border-transparent bg-[#06B6A4] px-4 py-2.5 text-sm font-medium text-white shadow-none hover:bg-[#08998B]"
              >
                <Link
                  href={`/products/${slug}`}
                  aria-label={`View details for ${product.name}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </article>
  );
};

export default ProductCard;
