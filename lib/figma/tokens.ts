/**
 * Figma design tokens derived from figma.json "Calenders Arun".
 *
 * These constants represent the extracted layout and color values
 * and are used to generate consistent Tailwind classes.
 */

/** RGBA → hex conversion utility */
const rgbaToHex = (r: number, g: number, b: number, a = 1): string => {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  const alpha = a < 1 ? toHex(a) : "";
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`.toUpperCase();
};

export const FIGMA_COLORS = {
  /** Page background — r:0.969 g:0.984 b:0.976 */
  pageBg: rgbaToHex(0.96862745, 0.98431373, 0.97647059),
  /** Product Selection background — r:0.969 g:0.988 b:0.976 */
  pageBgAlt: rgbaToHex(0.96862745, 0.98823529, 0.97647059),
  /** Navbar border — rgba(0,0,0,0.08) */
  navbarBorder: "rgba(0,0,0,0.08)",
} as const;

export const FIGMA_SPACING = {
  /** Navbar padding — px-8 (32px) */
  navbarPaddingX: 32,
  /** Landing navbar padding — px-12 (48px) */
  navbarPaddingXLanding: 48,
  /** Outer page margin — Product Details */
  outerMarginX: 120,
  /** Container padding */
  containerPadding: 32,
  /** Section gap */
  sectionGap: 32,
  /** Product card gap */
  cardGap: 28,
  /** Nav item spacing */
  navItemSpacing: 8,
  /** Nav container padding */
  navContainerPaddingX: 24,
} as const;

export const FIGMA_LAYOUT = {
  /** Navbar height for product/catalog pages */
  navbarHeight: 64,
  /** Navbar height for landing page */
  navbarHeightLanding: 72,
  /** Max content width */
  contentMaxWidth: 1200,
  /** Full design width */
  frameWidth: 1440,
} as const;

/**
 * Maps a Figma RGBA color object to a CSS hex string.
 */
export const figmaColorToHex = (
  r: number,
  g: number,
  b: number,
  a = 1,
): string => rgbaToHex(r, g, b, a);

/**
 * Maps a Figma layout mode to CSS flex-direction.
 */
export const figmaLayoutToFlex = (
  layoutMode: "HORIZONTAL" | "VERTICAL" | "NONE",
): string => {
  switch (layoutMode) {
    case "HORIZONTAL":
      return "flex-row";
    case "VERTICAL":
      return "flex-col";
    default:
      return "";
  }
};

/**
 * Maps a Figma primaryAxisAlignItems to Tailwind justify class.
 */
export const figmaJustifyToTailwind = (
  alignment: string | undefined,
): string => {
  switch (alignment) {
    case "CENTER":
      return "justify-center";
    case "MAX":
      return "justify-end";
    case "SPACE_BETWEEN":
      return "justify-between";
    case "MIN":
    default:
      return "justify-start";
  }
};

/**
 * Maps a Figma counterAxisAlignItems to Tailwind items class.
 */
export const figmaAlignToTailwind = (alignment: string | undefined): string => {
  switch (alignment) {
    case "CENTER":
      return "items-center";
    case "MAX":
      return "items-end";
    case "STRETCH":
      return "items-stretch";
    case "MIN":
    default:
      return "items-start";
  }
};
