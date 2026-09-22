# Port Allocation Convention

To ensure deterministic local development without port collisions across multiple Next.js applications, the platform enforces a sequential port numbering scheme.

---

## Port Allocation Matrix

| Application          | Role                         | Port      | Path Prefix    | Notes                                            |
| -------------------- | ---------------------------- | --------- | -------------- | ------------------------------------------------ |
| `zones/shell`        | Ingress Host & Control Plane | **8000**  | `/`            | Serves root domain, acts as reverse proxy router |
| `zones/<next-app-1>` | Secondary Zone 1             | **8001**  | `/<subpath-1>` | First secondary zone application                 |
| `zones/<next-app-2>` | Secondary Zone 2             | **8002**  | `/<subpath-2>` | Second secondary zone application                |
| `zones/<next-app-3>` | Secondary Zone 3             | **8003**  | `/<subpath-3>` | Third secondary zone application                 |
| `...`                | Subsequent Zones             | **8004+** | `/<subpath-n>` | Increment sequentially                           |

---

## Port Rules

1. **Shell Priority**: Port `8000` is strictly reserved for `zones/shell`.
2. **Deterministic Sequence**: Every new application added to `zones/` must claim the next available sequential port (`8001`, `8002`, `8003`, etc.).
3. **Configuration Synchronization**:
   - `package.json`: `"scripts": { "dev": "next dev -p <PORT> --turbopack", "start": "next start -p <PORT>" }`
   - `.env`: Configure zone destination URL (e.g. `<ZONE>_URL=http://localhost:<PORT>`)
   - `zones/shell/next.config.ts`: Add corresponding rewrite rule.
