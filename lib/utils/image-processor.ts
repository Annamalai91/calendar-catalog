import sharp from "sharp";

interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

interface ProcessImageOptions {
  /** WebP quality 1-100. Default: 80 */
  quality?: number;
}

/**
 * Converts an image buffer to WebP format without changing resolution.
 *
 * - Preserves original dimensions (no resizing)
 * - Converts to WebP to reduce file size (~60-70% smaller than PNG/JPG)
 * - Strips metadata (EXIF, ICC profiles) to reduce file size
 *
 * Used exclusively in the admin upload API route (server-side only).
 */
export async function processImage(
  inputBuffer: Buffer,
  options: ProcessImageOptions = {},
): Promise<ProcessedImage> {
  const { quality = 80 } = options;

  const outputBuffer = await sharp(inputBuffer)
    .webp({ quality })
    .toBuffer();

  return {
    buffer: outputBuffer,
    contentType: "image/webp",
    extension: "webp",
  };
}

