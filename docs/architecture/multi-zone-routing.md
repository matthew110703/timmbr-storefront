# Multi-Zone Routing & Ingress Proxy

Next.js Native Multi-Zones allow multiple independent Next.js applications to be merged under a single domain without using Webpack Module Federation or complex iframe microfrontends.

---

## 1. How Ingress Routing Works

The `shell` application runs on port **8000** and serves the root domain (`/`). It acts as a reverse proxy for all other secondary zone applications running on subsequent ports (8001, 8002, etc.).

### Ingress Rewrites in `zones/shell/next.config.ts`

When a new zone application is added, its routes are registered in the `shell` rewrites configuration:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_DOMAIN || "localhost:8000"],
    },
  },

  async rewrites() {
    const APP_URL = process.env.APP_ZONE_URL || "http://localhost:8001";

    return [
      // Zone Application Routes & Static Assets
      { source: "/app", destination: `${APP_URL}/app` },
      { source: "/app/:path*", destination: `${APP_URL}/app/:path*` },
      {
        source: "/app-static/:path*",
        destination: `${APP_URL}/app-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

---

## 2. Asset Namespacing & Isolation

To ensure that static JS chunks, CSS files, and images from different zone applications do not collide under `_next/static`, every secondary zone MUST configure:

1. **`basePath`**: The sub-path root (e.g., `/app`).
2. **`assetPrefix`**: An isolated prefix (e.g., `/app-static`).

In the secondary zone's `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/app",
  assetPrefix: "/app-static",
  reactCompiler: true,
};

export default nextConfig;
```

---

## 3. Cross-Zone Navigation

Within the same zone application, standard Next.js client-side navigation (`next/link`) can be used.

When navigating across zones (e.g. from `/` in `shell` to `/app` in a secondary zone):

- Standard HTML `<a>` tags should be used to allow full browser URL transitions.
- Speculative prefetching can be attached to `<link rel="prefetch">` on hover.
