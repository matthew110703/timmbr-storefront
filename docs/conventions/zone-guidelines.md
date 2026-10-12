# Zone Application Creation Guidelines

When adding a new Next.js application to the platform, follow this checklist.

---

## 1. Directory Structure

Applications must live inside the `zones/` directory:

```text
zones/<zone-name>/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── env.ts             # Schema-validated env
│   └── proxy.ts           # Next.js 16 Edge proxy
├── public/
├── next.config.ts         # basePath & assetPrefix configuration
├── tsconfig.json          # moduleResolution: "bundler"
└── package.json
```

---

## 2. Port Assignment

Allocate the next sequential port according to the [Port Allocation Convention](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/ports.md):

- `shell`: 8000
- 1st secondary app: 8001
- 2nd secondary app: 8002
- etc.

---

## 3. Configuration Requirements

In `next.config.ts`:

- Set `assetPrefix: '/<zone-name>-static'` (always required)
- Set `basePath: '/<zone-name>'` (the default, see below for the exception)
- Set `reactCompiler: true`

In `zones/shell/next.config.ts`:

- Add the rewrites mapping `/<zone-name>` and `/<zone-name>-static` to the zone's port.

### Zones that own several top-level paths

A `basePath` limits a zone to one URL prefix. A zone that must serve several top-level paths and soft-navigate between them omits `basePath`. `zones/catalog` is the example: it serves `/products` and `/category`.

- Put its routes under matching folders in `src/app/` (`app/products/…`, `app/category/…`). Don't add a root `page.tsx`: `/` belongs to the shell.
- Add a shell rewrite for each path (`/products`, `/products/:path*`, `/category`, `/category/:path*`) plus `/<zone-name>-static/:path*`.
- `assetPrefix` doesn't cover `public/`. Keep public files under `public/<zone-name>-static/` so they're served at a path the shell already routes to the zone.
- Set `images.path: '/<zone-name>-static/_next/image'`, so image optimisation stays in the zone instead of the shell's root `/_next/image`.
- Links inside the zone use full paths (`/products/x`, `/category/y`), since there is no basePath for next/link to add.
