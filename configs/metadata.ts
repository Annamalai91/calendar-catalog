import type { Metadata } from "next";
import { APP_TEXT, SEO_TEXT, SITE_CONFIG } from "@configs/constants";

// ---------------------------------------------------------------------------
// Site-wide constants
// ---------------------------------------------------------------------------

export const SITE = {
  name: APP_TEXT.brand.siteName,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? SITE_CONFIG.defaultBaseUrl,
  locale: SITE_CONFIG.locale,
} as const;

// ---------------------------------------------------------------------------
// Root metadata — used in app/layout.tsx
// ---------------------------------------------------------------------------

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: SEO_TEXT.root.titleDefault,
    template: `${SEO_TEXT.root.titleTemplate} | ${SITE.name}`,
  },
  description: SEO_TEXT.root.description,
  keywords: [...SEO_TEXT.root.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SEO_TEXT.root.openGraphTitle,
    description: SEO_TEXT.root.openGraphDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TEXT.root.twitterTitle,
    description: SEO_TEXT.root.twitterDescription,
  },
  icons: {
    icon: "/assets/logo-v2.png",
    shortcut: "/assets/logo-v2.png",
    apple: "/assets/logo-v2.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ---------------------------------------------------------------------------
// Home page metadata — used in app/page.tsx
// ---------------------------------------------------------------------------

export const homeMetadata: Metadata = {
  title: SEO_TEXT.home.title,
  description: SEO_TEXT.home.description,
};

// ---------------------------------------------------------------------------
// Products catalog metadata — used in app/products/page.tsx
// ---------------------------------------------------------------------------

export const productsMetadata: Metadata = {
  title: SEO_TEXT.products.title,
  description: SEO_TEXT.products.description,
  openGraph: {
    title: `${SEO_TEXT.products.title} — ${SITE.name}`,
    description: SEO_TEXT.products.openGraphDescription,
  },
};

// ---------------------------------------------------------------------------
// Product detail metadata — used in app/products/[slug]/page.tsx
// ---------------------------------------------------------------------------

export const buildProductMetadata = (product: {
  name: string;
  description: string;
  cover_image: string;
  meta_title?: string;
  meta_description?: string;
}): Metadata => {
  const title = product.meta_title ?? product.name;
  const description = product.meta_description ?? product.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — ${SITE.name}`,
      description,
      images: [{ url: product.cover_image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};
