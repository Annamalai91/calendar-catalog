import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All product images are local — no external domains needed
    formats: ["image/avif", "image/webp"],
    // Allow unoptimized for SVG placeholders during development
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
