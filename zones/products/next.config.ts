import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/products",
  assetPrefix: "/products-static",
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
    ],
  },
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000"],
    },
  },
};

export default nextConfig;
