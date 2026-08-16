export const SITE_CONFIG = {
  defaultBaseUrl: "https://www.vidhyasrienterprises.in",
  locale: "en_US",
} as const;

export const APP_TEXT = {
  common: {
    home: "Home",
    catalog: "Catalog",
    categories: "Categories",
  },
  brand: {
    shortName: "VE",
    name: "Vidhyasri Enterprises",
    siteName: "Vidhyasri Enterprises",
    homeAriaLabel: "Vidhyasri Enterprises - Home",
  },
  homePage: {
    heroTag: "Vidhyasri Enterprises Excellence",
    heroTitle: "Beyond Boundaries in Print",
    heroDescription: "All types of printing jobs — calendars, keychains, and premium diaries — crafted with precision to shape the way you own your year.",
    heroPrimaryCta: "Explore Calendars",
    heroImageAlt: "Premium calendars collection",
    heroPreviousSlideAria: "Previous slide",
    heroNextSlideAria: "Next slide",
    heroImageCaption: "Premium Calendars Collection",
    expertiseTitle: "Our Categories & Expertise",
    expertiseDescription: "From daily planning to corporate gifting, every product we craft is designed to inspire and built to last.",
    expertiseSecondaryCta: "Go to Store",
    expertiseCards: [
      {
        title: "Wall Calendars",
        body: "Vibrant, high-resolution prints featuring scenic landscapes, art, and customizable corporate branding for your office or home.",
      },
      {
        title: "Desk Planners",
        body: "Compact and elegant designs with premium paper quality, perfectly structured for daily notes, meetings, and tight schedules.",
      },
      {
        title: "Corporate Gifting",
        body: "Curated premium diary and pen sets in elegant packaging. Make a lasting, professional impression on clients and employees.",
      },
    ],
  },
  notFoundPage: {
    code: "404",
    title: "Page Not Found",
    description:
      "The page you are looking for does not exist or has been moved.",
    cta: "Back to Home",
  },
  navbar: {
    menuOpenAriaLabel: "Open menu",
    contactSectionTitle: "Contact",
    socialSectionTitle: "Socials",
    downloadsSectionTitle: "Downloads",
    contactAndSocialAriaLabel: "Contact and social links",
    storeCta: "Go to Store",
    contactLinkLabels: {
      call: "Call",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      email: "Email",
    },
    quickContactLabels: {
      call: "Call",
      email: "Email",
    },
  },
  footer: {
    ariaLabel: "Site footer",
    aboutTitle: "About Us",
    aboutDescription:
      "At Vidhyasri Enterprises, we turn everyday printing into something worth keeping. Rooted in Sivakasi's manufacturing heritage, we bring hands-on craft to every order — treating each one, big or small, like it's our own.",
    catalogTitle: "Catalog",
    registeredOfficeTitle: "Registered Office",
    registeredOfficeAddress: [
      "Vidhyasri Enterprises",
      "1257A, Gnangiri Road,",
      "Sivakasi - 626189",
    ],
    factoryAddressTitle: "Factory Address",
    factoryAddress: [
      "111, Gandhi Road,",
      "Behind Manikandan Orthopedic Clinic,",
      "Sivakasi - 626189",
    ],
    links: {},
    copyrightSuffix: "Vidhyasri Enterprises. All rights reserved.",
  },
  productsPage: {
    catalogLabel: "Catalog",
    productSingular: "product",
    productPlural: "products",
    selectedCategoryLabels: {
      category: "Category",
      size: "Size",
      search: "Search",
    },
    mobileCategoriesButton: "Categories",
    mobileCategoriesTitle: "Product Categories",
  },
  productDetailPage: {
    metadataNotFoundTitle: "Product Not Found",
    relatedProductsTitle: "Related Products",
    ariaLabelPrefix: "Product detail:",
    breadcrumb: {
      products: "Catalog",
    },
  },
  productFilter: {
    ariaLabel: "Product filters",
  },
  productGrid: {
    ariaLabel: "Product grid",
    emptyTitle: "No products found",
    emptyDescription: "Try adjusting your filters.",
  },
  productCard: {
    previewAriaPrefix: "Preview",
    paperSuffix: "Paper",
    viewDetails: "View Details",
    viewDetailsAriaPrefix: "View details for",
  },
  productDetails: {
    backToCatalog: "Back to Catalog",
    descriptionTitle: "Description",
    sizePrefix: "Size:",
    paperTypePrefix: "Paper Type:",
    downloadSample: "Download Sample",
  },
  productGallery: {
    frontView: "Front view",
    detailView: "Detail view",
    tabListAriaLabel: "Product images",
    openPreviewPrefix: "Open image preview for",
    imagePreviewSuffix: "image preview",
    close: "Close",
  },
  productPreview: {
    previousDesignAria: "Previous design",
    nextDesignAria: "Next design",
    showPrefix: "Show",
    mobileViewDetails: "View details",
    nameLabel: "Name",
    categoryLabel: "Category",
    descriptionLabel: "Description",
    sizeLabel: "Size",
    paperTypeLabel: "Paper Type",
    advtSpaceLabel: "Advertisement Space",
    closePreviewAria: "Close preview",
  },
  requestQuote: {
    trigger: "Request a Quote",
    badge: "Quote Support",
    titlePrefix: "Request a quote for",
    description:
      "Reach us through any channel below. Contact details are synced with the site navbar.",
    values: {
      whatsapp: "Quick chat",
      instagram: "Direct message",
    },
  },
} as const;

export const SEO_TEXT = {
  root: {
    titleDefault: "Vidhyasri Enterprises - Premium Calendar Printing",
    titleTemplate: "%s",
    description:
      "Browse our premium calendar collection. Monthly, yearly, and custom calendars with art and gloss paper options. Quality printing for every occasion.",
    keywords: [
      "calendar",
      "calendar printing",
      "monthly calendar",
      "custom calendar",
    ],
    openGraphTitle: "Vidhyasri Enterprises- Premium Calendar Printing",
    openGraphDescription:
      "Browse our premium calendar collection with art and gloss paper options.",
    twitterTitle: "Vidhyasri Enterprises - Premium Calendar Printing",
    twitterDescription: "Browse our premium calendar collection.",
  },
  home: {
    title: "Vidhyasri Enterprises - Premium Calendar Printing ",
    description:
      "Masterpieces for your wall and desk with premium calendar printing, corporate planners, and gifting collections.",
  },
  products: {
    title: "Product Catalog",
    description:
      "Browse our full calendar catalog. Filter by category and size to find your perfect calendar.",
    openGraphDescription: "Browse our full calendar catalog.",
  },
} as const;

export const INDEXING = {
  userAgent: "*",
  allow: "/",
  disallow: ["/api/", "/_next/"],
  sitemapPath: "/sitemap.xml",
} as const;

export const SITEMAP = {
  staticRoutes: {
    productsPath: "/products",
  },
  frequencies: {
    home: "weekly",
    products: "daily",
    category: "weekly",
    product: "monthly",
  },
  priorities: {
    home: 1,
    products: 0.9,
    category: 0.8,
    product: 0.7,
  },
} as const;
