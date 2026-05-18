/** Common utility types used across the application */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

/** Next.js page props with async params */
export interface PageProps<TParams = Record<string, string>> {
  params: Promise<TParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** SEO metadata shape */
export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  openGraphImage?: string;
  canonicalUrl?: string;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
