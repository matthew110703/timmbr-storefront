# Port Allocation Convention

To ensure deterministic local development without port collisions across multiple Next.js applications, the platform enforces a sequential port numbering scheme.

---

## Port Allocation Matrix

| Application      | Role                               | Port      | Path Prefix    | Notes                                             |
| ---------------- | ---------------------------------- | --------- | -------------- | ------------------------------------------------- |
| `zones/shell`    | Storefront Landing & Ingress Proxy | **3000**  | `/`            | Serves root landing page and reverse proxy router |
| `zones/products` | Product Catalog & Details          | **3001**  | `/products`    | Product catalog zone                              |
| `zones/checkout` | Dedicated Checkout Flow            | **3002**  | `/checkout`    | Checkout & order confirmation zone                |
| `zones/account`  | User Profile, Orders & Settings    | **3003**  | `/account`     | Account & profile management zone                 |
| `...`            | Subsequent Zones                   | **3004+** | `/<subpath-n>` | Increment sequentially                            |

---

## Port Rules

1. **Shell Priority**: Port `3000` is strictly reserved for `zones/shell`.
2. **Deterministic Sequence**: Every new application added to `zones/` must claim the next available sequential port (`3001`, `3002`, `3003`, etc.).
3. **Configuration Synchronization**:
   - `package.json`: `"scripts": { "dev": "next dev -p <PORT> --turbopack", "start": "next start -p <PORT>" }`
   - `.env`: Configure zone destination URL (e.g. `<ZONE>_URL=http://localhost:<PORT>`)
   - `zones/shell/next.config.ts`: Add corresponding rewrite rule.
