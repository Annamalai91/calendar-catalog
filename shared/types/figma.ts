/** Figma API node types — strict subset used by this project */

export type FigmaNodeType =
  | "DOCUMENT"
  | "CANVAS"
  | "FRAME"
  | "GROUP"
  | "TEXT"
  | "RECTANGLE"
  | "VECTOR"
  | "ELLIPSE"
  | "COMPONENT"
  | "INSTANCE"
  | "IMAGE"
  | "BOOLEAN_OPERATION";

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaFill {
  blendMode: string;
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "IMAGE";
  color?: FigmaColor;
  opacity?: number;
  imageRef?: string;
}

export interface FigmaBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaLayoutConstraints {
  vertical: "TOP" | "BOTTOM" | "CENTER" | "TOP_BOTTOM" | "SCALE";
  horizontal: "LEFT" | "RIGHT" | "CENTER" | "LEFT_RIGHT" | "SCALE";
}

export interface FigmaStrokeWeights {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: FigmaNodeType;
  scrollBehavior?: string;
  children?: FigmaNode[];
  blendMode?: string;
  clipsContent?: boolean;
  fills?: FigmaFill[];
  strokes?: FigmaFill[];
  strokeWeight?: number;
  individualStrokeWeights?: FigmaStrokeWeights;
  strokeAlign?: string;
  backgroundColor?: FigmaColor;
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  counterAxisSizingMode?: "FIXED" | "AUTO";
  primaryAxisSizingMode?: "FIXED" | "AUTO";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "BASELINE" | "STRETCH";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  layoutWrap?: "NO_WRAP" | "WRAP";
  absoluteBoundingBox?: FigmaBoundingBox;
  absoluteRenderBounds?: FigmaBoundingBox;
  constraints?: FigmaLayoutConstraints;
  layoutAlign?: "INHERIT" | "STRETCH" | "MIN" | "CENTER" | "MAX";
  layoutGrow?: number;
  layoutSizingHorizontal?: "FIXED" | "FILL" | "HUG";
  layoutSizingVertical?: "FIXED" | "FILL" | "HUG";
  maxWidth?: number;
  minHeight?: number;
  effects?: unknown[];
  interactions?: unknown[];
  itemReverseZIndex?: boolean;
  strokesIncludedInLayout?: boolean;
}

export interface FigmaDocument extends FigmaNode {
  type: "DOCUMENT";
  children: FigmaPage[];
}

export interface FigmaPage extends FigmaNode {
  type: "CANVAS";
  children: FigmaFrame[];
  backgroundColor?: FigmaColor;
  prototypeStartNodeID?: string | null;
}

export interface FigmaFrame extends FigmaNode {
  type: "FRAME";
}

export interface FigmaFile {
  document: FigmaDocument;
  components: Record<string, unknown>;
  componentSets: Record<string, unknown>;
  schemaVersion: number;
  styles: Record<string, unknown>;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

/** Derived design token extracted from a FigmaNode */
export interface FigmaDesignToken {
  backgroundColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  paddingX?: number;
  paddingY?: number;
  gap?: number;
  layoutMode?: "horizontal" | "vertical";
  justifyContent?: string;
  alignItems?: string;
  maxWidth?: number;
}
