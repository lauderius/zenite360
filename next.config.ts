import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ignore TypeScript errors in backup folders
    ignoreBuildErrors: false,
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
