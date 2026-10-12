import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No basePath: this zone owns several top-level paths (/products, /category),
  // each routed here by the shell's rewrites. assetPrefix keeps its assets apart.
  assetPrefix: "/catalog-static",
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
    // Keep image optimisation in this zone (the shell owns the root /_next/image).
    path: "/catalog-static/_next/image",
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
