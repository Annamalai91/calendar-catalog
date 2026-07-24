interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

interface ProcessImageOptions {
  /** WebP quality 1-100. Default: 80 */
  quality?: number;
  /** Fallback content type if sharp processing fails or module is unavailable */
  fallbackContentType?: string;
  /** Fallback file extension or original file name */
  fallbackName?: string;
}

/**
 * Converts an image buffer to WebP format without changing resolution.
 *
 * If sharp module fails to load or execute (e.g. missing native linux C++ binaries on Vercel),
 * it gracefully falls back to returning the original image buffer and file type.
 *
 * Used in the admin upload API route (server-side only).
 */
export async function processImage(
  inputBuffer: Buffer,
  options: ProcessImageOptions = {},
): Promise<ProcessedImage> {
  const { quality = 80, fallbackContentType = "image/jpeg", fallbackName = "image.jpg" } = options;

  try {
    // Dynamic import prevents module evaluation failure if native bindings are missing
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default || sharpModule;

    const outputBuffer = await sharp(inputBuffer)
      .webp({ quality })
      .toBuffer();

    return {
      buffer: outputBuffer,
      contentType: "image/webp",
      extension: "webp",
    };
  } catch (err: any) {
    console.warn("[image-processor] Sharp unavailable or failed, using original image:", err?.message || err);

    let ext = "jpg";
    if (fallbackName && fallbackName.includes(".")) {
      ext = fallbackName.split(".").pop()?.toLowerCase() || "jpg";
    } else if (fallbackContentType && fallbackContentType.includes("/")) {
      ext = fallbackContentType.split("/")[1]?.toLowerCase() || "jpg";
      if (ext === "jpeg") ext = "jpg";
    }

    return {
      buffer: inputBuffer,
      contentType: fallbackContentType || "image/jpeg",
      extension: ext,
    };
  }
}
