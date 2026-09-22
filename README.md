# @timmbr Storefront Platform

A modern, high-performance web platform built on **Next.js Native Multi-Zones**, **React 19**, **Turbopack**, and **pnpm workspaces**.

The platform is structured as an **apps-only monorepo** where independent zone applications live under `zones/`, orchestrated by a central ingress host (`zones/shell`) running on **Port 8000**.

---

## 🏛️ Architecture Highlights

- **Next.js Native Multi-Zones**: Sub-path reverse-proxy routing under a unified domain (`timmbr.com` or `localhost:8000`). Zero Webpack Module Federation overhead.
- **Ingress Control Plane (`zones/shell`)**: Runs on **Port 8000**, serving the root domain (`/`), edge proxy headers, and proxy rewrites to downstream zones.
- **Port Allocation Convention**: Port `8000` is reserved for `shell`. Subsequent zone applications are assigned sequential ports starting from **8001**, **8002**, **8003**, etc.
- **Modern Rust Toolchain**:
  - **Turbopack**: Fast Refresh and dev bundling with sub-second startup times (`next dev --turbopack`).
  - **React Compiler**: Automated component tree memoization enabled via `reactCompiler: true`.
  - **SWC**: Native Rust transpilation and minification for production builds.
- **Edge Security & Routing**: Next.js 16 `proxy.ts` convention for edge security headers and correlation request tracing.
- **Type-Safe Environment**: Schema-validated environment variables powered by `@t3-oss/env-nextjs` and `zod`.
- **Co-located Static Strings**: Every route segment maintains a co-located `strings.ts` file for zero-hardcoded UI copy.

---

## 📁 Repository Layout

```text
timmbr-storefront/
├── .agents/                 # AI Agent operational rules & skills
│   ├── rules.md             # Platform-wide rules
│   └── skills/              # Specialized skills (e.g. strings-management)
├── .github/                 # GitHub Actions CI/CD workflows
│   └── workflows/ci.yml     # Dynamic multi-zone verification pipeline
├── .husky/                  # Git pre-commit hooks (lint-staged)
├── docs/                    # Central Platform Knowledge Base
│   ├── README.md            # Knowledge base index
│   ├── architecture/        # System design, multi-zone routing, and CI/CD
│   └── conventions/         # Ports, environment, strings, testing, and zone guides
├── e2e/                     # Cross-zone Playwright integration tests
├── scripts/                 # Development runners & orchestration
│   └── dev-runner.js        # Zero-filter dev runner (auto-includes shell)
├── zones/                   # Multi-zone application packages
│   └── shell/               # Ingress router & domain control plane (Port 8000)
├── .env.example             # Committed local environment defaults
├── .gitignore               # Comprehensive git ignore rules
├── AGENTS.md                # AI Agent & developer architectural contract
├── package.json             # Root monorepo orchestration & scripts
├── playwright.config.ts     # Playwright E2E configuration
├── pnpm-workspace.yaml      # Monorepo package discovery (`zones/*`)
└── turbo.json               # Turborepo task pipeline
```

---

## ⚡ Prerequisites

- **Node.js**: `v20.x` or `v22.x` / `v24.x` (LTS recommended)
- **pnpm**: `v10.x` or `v11.x` (`packageManager: pnpm@11.18.0`)

---

## 🚀 Quick Start & Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy the committed default template to create your local `.env`:

```bash
cp .env.example .env
```

Defaults:

```env
PORT=8000
NEXT_PUBLIC_DOMAIN=localhost:8000
```

### 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:8000](http://localhost:8000) to view the shell homepage, or [http://localhost:8000/health](http://localhost:8000/health) for the liveness probe.

---

## 🛠️ Development Workflows

The custom runner ([`scripts/dev-runner.js`](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/scripts/dev-runner.js)) eliminates the need to manually pass complex Turborepo `--filter` flags:

| Command                    | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                 | Boots primary `shell` host on port 8000                            |
| `pnpm dev <zone>`          | Boots `shell` + specified secondary zone (e.g. `pnpm dev catalog`) |
| `pnpm dev <zone1> <zone2>` | Boots `shell` + multiple specified zones concurrently              |
| `pnpm dev:all`             | Boots `shell` + **all discovered zones** under `zones/*`           |

---

## 🧪 Testing & Verification

| Command            | Tool           | Purpose                                                    |
| ------------------ | -------------- | ---------------------------------------------------------- |
| `pnpm check-types` | `tsc --noEmit` | TypeScript type-checking across all packages               |
| `pnpm lint`        | ESLint 9       | Linting and code style checks across all packages          |
| `pnpm test`        | Vitest         | Fast unit and component tests within zone packages         |
| `pnpm test:e2e`    | Playwright     | Full cross-zone integration tests against `localhost:8000` |
| `pnpm build`       | Next.js / SWC  | Production bundle build via Turborepo                      |

---

## 🔄 CI/CD & Git Pre-Commit Hooks

- **Pre-commit Hooks**: Managed by **Husky** and **lint-staged**. Staged files are automatically formatted with Prettier and linted with ESLint whenever you execute `git commit`.
- **GitHub Actions**: Configured in [`.github/workflows/ci.yml`](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/.github/workflows/ci.yml).
  - Triggers on `push` and `pull_request` against `main` and `staging`.
  - Dynamically detects changes via Turborepo (`--filter="...[origin/${{ github.base_ref }}]"`) with zero hardcoded zone names.
  - Executes `install`, `lint`, `check-types`, and `build`.

---

## 📖 Knowledge Base & Documentation

Detailed architecture specifications, conventions, and guidelines are available in [`docs/`](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/README.md):

- [System Design & Master Architecture](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/architecture/system-design.md)
- [Multi-Zone Routing & Ingress Proxy](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/architecture/multi-zone-routing.md)
- [CI/CD Pipeline](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/architecture/ci-cd.md)
- [Port Allocation Matrix](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/ports.md)
- [Static Strings Convention (`strings.ts`)](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/strings.md)
- [Environment Strategy](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/environment.md)
- [Testing Strategy](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/testing.md)
- [Zone Creation Checklist](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/zone-guidelines.md)
