import { notFound } from "next/navigation";
import ProductGallery from "@components/product/product-gallery";
import ProductDetails from "@components/product/product-details";
import ProductGrid from "@components/product/product-grid";
import Breadcrumbs from "@components/breadcrumbs";
import { Separator } from "@components/ui/separator";
import {
  getProductBySlug,
  getAllProductSlugs,
  getCachedAllProducts,
} from "@data/products";
import { toSlug } from "@lib/utils/slug";
import type { Metadata } from "next";
import type { PageProps } from "@shared/types/common";
import type { ProductDetailParams } from "./type";
import { buildProductMetadata } from "@configs/metadata";
import { APP_TEXT } from "@configs/constants";

/**
 * Generates static params for all known product slugs.
 * Enables full static generation at build time.
 */
export const generateStaticParams = async () => {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: PageProps<ProductDetailParams>): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: APP_TEXT.productDetailPage.metadataNotFoundTitle };
  }

  return buildProductMetadata(product);
};

/**
 * Product Detail page — "/products/[slug]"
 *
 * Figma source: "Product Details" frame
 *   - Main:margin → paddingX: 120px (lg:px-[120px])
 *   - Main → max-width: 1200px, padding: 32px, itemSpacing: 32px
 *   - Layout: implied 2-column (gallery left, details right)
 *
 * Server Component — static generation via generateStaticParams.
 */
export default async function ProductDetailPage({
  params,
}: PageProps<ProductDetailParams>) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products — same category, excluding current
  const allProducts = await getCachedAllProducts();
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.main_category === product.main_category &&
        (p.slug ?? toSlug(p.name)) !== slug,
    )
    .slice(0, 3);

  return (
    <div className="bg-[#F7FBF9] dark:bg-[#0A0A0C] min-h-screen transition-colors">
      {/* Breadcrumb strip */}
      <div
        className="border-b border-black/10 dark:border-white/10 bg-[#F7FBF9] dark:bg-[#0A0A0C] px-8 py-4 transition-colors"
      >
        <div className="mx-auto max-w-360">
          <Breadcrumbs
            items={[
              { label: APP_TEXT.common.home, href: "/" },
              {
                label: APP_TEXT.productDetailPage.breadcrumb.products,
                href: "/products",
              },
              {
                label: product.main_category,
                href: `/products?category=${toSlug(product.main_category)}`,
              },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Main content — Figma: Main:margin (120px outer) → Main (max-1200px, 32px pad) */}
      <div className="mx-auto max-w-360 px-8 py-8 lg:py-12">
          {/* Product section: Gallery + Details */}
          <article
            aria-label={`${APP_TEXT.productDetailPage.ariaLabelPrefix} ${product.name}`}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
          >
            {/* Left: Gallery */}
            <ProductGallery
              coverImage={product.cover_image}
              fullImage={product.full_image}
              alt={product.name}
            />

            {/* Right: Details */}
            <ProductDetails product={product} />
          </article>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-16">
              <Separator className="mb-12" />
              <h2
                id="related-heading"
                className="text-xl font-bold text-foreground mb-7 sm:text-2xl"
              >
                {APP_TEXT.productDetailPage.relatedProductsTitle}
              </h2>
              <ProductGrid products={relatedProducts} />
            </section>
          )}
        </div>
    </div>
  );
}
