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

- Set `basePath: '/<zone-name>'`
- Set `assetPrefix: '/<zone-name>-static'`
- Set `reactCompiler: true`

In `zones/shell/next.config.ts`:

- Add the rewrites mapping `/<zone-name>` and `/<zone-name>-static` to the zone's port.
