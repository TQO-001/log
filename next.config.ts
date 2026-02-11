import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Essential for efficient VPS hosting
  images: {
    unoptimized: true,
  },
};

export default nextConfig;