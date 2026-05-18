import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Site-wide constants
// ---------------------------------------------------------------------------

export const SITE = {
  name: "Calenders Arun",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://calenders-arun.com",
  locale: "en_US",
} as const;

// ---------------------------------------------------------------------------
// Root metadata — used in app/layout.tsx
// ---------------------------------------------------------------------------

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: "Calenders Arun — Premium Calendar Printing",
    template: `%s | ${SITE.name}`,
  },
  description:
    "Browse our premium calendar collection. Monthly, yearly, and custom calendars with art and gloss paper options. Quality printing for every occasion.",
  keywords: [
    "calendar",
    "calendar printing",
    "monthly calendar",
    "custom calendar",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: "Calenders Arun — Premium Calendar Printing",
    description:
      "Browse our premium calendar collection with art and gloss paper options.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calenders Arun — Premium Calendar Printing",
    description: "Browse our premium calendar collection.",
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
  title: "Sivakasi Calendars — Premium Printing",
  description:
    "Masterpieces for your wall and desk with premium calendar printing, corporate planners, and gifting collections.",
};

// ---------------------------------------------------------------------------
// Products catalog metadata — used in app/products/page.tsx
// ---------------------------------------------------------------------------

export const productsMetadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse our full calendar catalog. Filter by category, size, and paper type to find your perfect calendar.",
  openGraph: {
    title: `Product Catalog — ${SITE.name}`,
    description: "Browse our full calendar catalog.",
  },
};

// ---------------------------------------------------------------------------
// Product detail metadata — used in app/products/[slug]/page.tsx
// ---------------------------------------------------------------------------

export const buildProductMetadata = (product: {
  name: string;
  description: string;
  image: string;
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
      images: [{ url: product.image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};
