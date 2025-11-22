import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all remote images (e.g., user-generated links) without blocking renders
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
