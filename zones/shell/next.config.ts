import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // transpilePackages will be enabled when @timmbr/ui and @timmbr/theme are linked
  // transpilePackages: ['@timmbr/ui', '@timmbr/theme'],
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_DOMAIN || "localhost:8000"],
    },
  },

  async rewrites() {
    // Secondary zone apps (allocated ports 8001, 8002, etc.) will be registered here
    return [];
  },
};

export default nextConfig;
