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
    const AUTH_ZONE_URL = process.env.AUTH_ZONE_URL || "http://localhost:3001";
    const PRODUCTS_ZONE_URL =
      process.env.PRODUCTS_ZONE_URL || "http://localhost:3002";
    const CHECKOUT_ZONE_URL =
      process.env.CHECKOUT_ZONE_URL || "http://localhost:3003";

    return [
      // Secondary zone: auth (Port 3001)
      {
        source: "/auth",
        destination: `${AUTH_ZONE_URL}/auth`,
      },
      {
        source: "/auth/:path*",
        destination: `${AUTH_ZONE_URL}/auth/:path*`,
      },
      {
        source: "/auth-static/:path*",
        destination: `${AUTH_ZONE_URL}/auth-static/:path*`,
      },

      // Secondary zone: products (Port 3002)
      {
        source: "/products",
        destination: `${PRODUCTS_ZONE_URL}/products`,
      },
      {
        source: "/products/:path*",
        destination: `${PRODUCTS_ZONE_URL}/products/:path*`,
      },
      {
        source: "/products-static/:path*",
        destination: `${PRODUCTS_ZONE_URL}/products-static/:path*`,
      },

      // Secondary zone: checkout (Port 3003)
      {
        source: "/checkout",
        destination: `${CHECKOUT_ZONE_URL}/checkout`,
      },
      {
        source: "/checkout/:path*",
        destination: `${CHECKOUT_ZONE_URL}/checkout/:path*`,
      },
      {
        source: "/checkout-static/:path*",
        destination: `${CHECKOUT_ZONE_URL}/checkout-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
