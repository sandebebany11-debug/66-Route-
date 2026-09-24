import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 defaults to only serving quality 75; the machine photos
    // are the site's signature visual, so allow near-lossless output too.
    qualities: [75, 90, 95, 100],
  },
};

export default nextConfig;
