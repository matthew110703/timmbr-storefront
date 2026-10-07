import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@timmbr/ui",
    "@timmbr/theme",
    "@timmbr/motion",
    "@timmbr/icons",
    "@timmbr/hooks",
    "@timmbr/utils",
    "@timmbr/auth",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
    const PRODUCTS_ZONE_URL =
      process.env.PRODUCTS_ZONE_URL || "http://localhost:3001";
    const CHECKOUT_ZONE_URL =
      process.env.CHECKOUT_ZONE_URL || "http://localhost:3002";
    const ACCOUNT_ZONE_URL =
      process.env.ACCOUNT_ZONE_URL || "http://localhost:3003";

    return [
      // Secondary zone: products (Port 3001)
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

      // Secondary zone: checkout (Port 3002)
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

      // Secondary zone: account (Port 3003)
      {
        source: "/account",
        destination: `${ACCOUNT_ZONE_URL}/account`,
      },
      {
        source: "/account/:path*",
        destination: `${ACCOUNT_ZONE_URL}/account/:path*`,
      },
      {
        source: "/account-static/:path*",
        destination: `${ACCOUNT_ZONE_URL}/account-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
