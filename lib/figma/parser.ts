import type { FigmaNode, FigmaDesignToken } from "@shared/types/figma";
import {
  figmaColorToHex,
  figmaLayoutToFlex,
  figmaJustifyToTailwind,
  figmaAlignToTailwind,
} from "./tokens";

/**
 * Extracts a design token summary from a FigmaNode.
 * Useful for mapping Figma frames to Tailwind layout utilities.
 */
export const parseNodeTokens = (node: FigmaNode): FigmaDesignToken => {
  const token: FigmaDesignToken = {};

  const bg = node.backgroundColor ?? node.fills?.[0]?.color;
  if (bg && node.fills?.[0]?.type === "SOLID") {
    token.backgroundColor = figmaColorToHex(bg.r, bg.g, bg.b, bg.a);
  }

  const stroke = node.strokes?.[0]?.color;
  if (stroke) {
    const opacity = node.strokes?.[0]?.opacity ?? 1;
    token.borderColor = figmaColorToHex(
      stroke.r,
      stroke.g,
      stroke.b,
      stroke.a * opacity,
    );
  }

  const bounds = node.absoluteBoundingBox;
  if (bounds) {
    token.width = bounds.width;
    token.height = bounds.height;
  }

  const px =
    node.paddingLeft !== undefined && node.paddingRight !== undefined
      ? (node.paddingLeft + node.paddingRight) / 2
      : (node.paddingLeft ?? node.paddingRight);
  const py =
    node.paddingTop !== undefined && node.paddingBottom !== undefined
      ? (node.paddingTop + node.paddingBottom) / 2
      : (node.paddingTop ?? node.paddingBottom);

  if (px !== undefined) token.paddingX = px;
  if (py !== undefined) token.paddingY = py;
  if (node.itemSpacing !== undefined) token.gap = node.itemSpacing;

  if (node.layoutMode && node.layoutMode !== "NONE") {
    token.layoutMode =
      node.layoutMode === "HORIZONTAL" ? "horizontal" : "vertical";
    token.justifyContent = figmaJustifyToTailwind(node.primaryAxisAlignItems);
    token.alignItems = figmaAlignToTailwind(node.counterAxisAlignItems);
  }

  if (node.maxWidth !== undefined) token.maxWidth = node.maxWidth;

  return token;
};

/**
 * Finds a named child node within a Figma node tree (depth-first).
 * Returns undefined gracefully — never throws.
 */
export const findNodeByName = (
  root: FigmaNode,
  name: string,
): FigmaNode | undefined => {
  if (root.name === name) return root;
  for (const child of root.children ?? []) {
    const found = findNodeByName(child, name);
    if (found) return found;
  }
  return undefined;
};

/**
 * Finds all nodes of a given type within a Figma node tree.
 */
export const findNodesByType = (
  root: FigmaNode,
  type: FigmaNode["type"],
): FigmaNode[] => {
  const results: FigmaNode[] = [];
  const traverse = (node: FigmaNode): void => {
    if (node.type === type) results.push(node);
    for (const child of node.children ?? []) traverse(child);
  };
  traverse(root);
  return results;
};

/**
 * Converts a Figma layout node into a set of Tailwind class names.
 * Skips gracefully if layout info is missing.
 */
export const nodeToTailwindClasses = (node: FigmaNode): string[] => {
  const classes: string[] = [];

  if (!node.layoutMode || node.layoutMode === "NONE") return classes;

  classes.push("flex");
  classes.push(figmaLayoutToFlex(node.layoutMode));

  const justify = figmaJustifyToTailwind(node.primaryAxisAlignItems);
  if (justify) classes.push(justify);

  const align = figmaAlignToTailwind(node.counterAxisAlignItems);
  if (align) classes.push(align);

  return classes;
};
