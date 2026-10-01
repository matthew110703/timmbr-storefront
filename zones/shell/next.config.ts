import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@timmbr/ui",
    "@timmbr/theme",
    "@timmbr/motion",
    "@timmbr/icons",
    "@timmbr/hooks",
    "@timmbr/utils",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev",
      },
    ],
  },
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000"],
    },
  },

  async rewrites() {
    const HOME_ZONE_URL = process.env.HOME_ZONE_URL || "http://localhost:3001";
    return [
      // Root ingress routes to product home page
      {
        source: "/",
        destination: `${HOME_ZONE_URL}/home`,
      },
      // Secondary zone: home
      {
        source: "/home",
        destination: `${HOME_ZONE_URL}/home`,
      },
      {
        source: "/home/:path*",
        destination: `${HOME_ZONE_URL}/home/:path*`,
      },
      {
        source: "/home-static/:path*",
        destination: `${HOME_ZONE_URL}/home-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
