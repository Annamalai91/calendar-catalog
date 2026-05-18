/**
 * Generates a URL-safe slug from a string.
 * Used for product and category routing.
 */
export const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Reverses a slug back to a human-readable label (best-effort).
 */
export const fromSlug = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
