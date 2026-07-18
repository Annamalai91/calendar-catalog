import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { getPaperBadgeClassName, sizeBadgeClassName } from "./badge-styles";
import { Tag, Layers, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ProductDetailsProps } from "./type";
import RequestQuoteDialog from "./request-quote-dialog";
import { APP_TEXT } from "@configs/constants";

/**
 * ProductDetails — right-panel product information for detail page.
 *
 * Figma source: "Main" frame in Product Details
 *   - layoutMode: VERTICAL, itemSpacing: 32px
 *   - paddingLeft: 32px, paddingRight: 32px
 *
 * Server Component.
 */
const ProductDetails = ({ product }: ProductDetailsProps) => {
  const imageExtension = product.cover_image.split(".").pop()?.split("?")[0] ?? "jpg";
  const downloadFileName = `${product.slug ?? "product"}-sample.${imageExtension}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {APP_TEXT.productDetails.backToCatalog}
      </Link>

      {/* Category breadcrumb */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
          {product.main_category}
        </p>
        <h1 className="text-2xl font-bold text-foreground leading-tight sm:text-3xl">
          {product.name}
        </h1>
      </div>

      {/* Tag */}
      {product.tag && (
        <div>
          <Badge variant="success" className="gap-1.5">
            <Tag className="h-3 w-3" />
            {product.tag}
          </Badge>
        </div>
      )}

      <Separator />

      {/* Description */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {APP_TEXT.productDetails.descriptionTitle}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge className={`${sizeBadgeClassName} gap-1.5 px-3 py-1`}>
            <Layers className="h-3.5 w-3.5" />
            {APP_TEXT.productDetails.sizePrefix}{" "}
            {product.size ?? product.sub_category}
          </Badge>
          <Badge
            className={`${getPaperBadgeClassName(product.paper_type)} gap-1.5 px-3 py-1`}
          >
            <FileText className="h-3.5 w-3.5" />
            {APP_TEXT.productDetails.paperTypePrefix} {product.paper_type}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <RequestQuoteDialog productName={product.name} />
        <Button
          variant="outline"
          size="lg"
          className="flex-1 py-3 sm:py-0 sm:flex-none"
          asChild
        >
          <a href={product.cover_image} download={downloadFileName}>
            {APP_TEXT.productDetails.downloadSample}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
