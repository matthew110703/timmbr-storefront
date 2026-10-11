# Next.js Native Multi-Zone Architecture & System Design

**Platform Target**: `@timmbr`  
**Architecture Pattern**: Next.js Native Multi-Zones (App Router, RSC, Turbopack)  
**Package Manager & Orchestrator**: `pnpm` workspaces + `Turborepo`  
**Compiler & Toolchain**: Turbopack (Dev Bundler) + SWC (Transpiler/Minifier) + React Compiler

---

## 1. Executive Summary & Core Principles

The platform is structured as an **apps-only monorepo** utilizing **Next.js Native Multi-Zones**.

### Key Architectural Commitments

1. **Zero Webpack Module Federation**: Native Multi-Zones route traffic at the URL sub-path level, ensuring **100% compatibility with Next.js 16 App Router, React Server Components (RSC), and Turbopack**.
2. **Apps-Only Monorepo Workspace (`zones/`)**: Applications live strictly in `zones/`. No local component libraries live in this repository.
3. **Autonomous Deployments**: Each zone application in `zones/` is completely decoupled. Deploying an update to any secondary zone requires zero rebuilds or redeployments of `zones/shell` or sibling zones.
4. **Transparent Ingress Proxying**: The `shell` application hosts the domain root (`/`, Port `8000`) and acts as the central reverse-proxy router, proxying requests for sub-paths to independent zone apps seamlessly under a unified domain.
5. **Shell-Owned Sessions**: The shell is the only app with _server-side_ auth code: its `proxy.ts` refreshes the session and gates protected paths for every zone, and it serves `/api/auth/*` (sign-in, logout, session, banner) and `/api/core/*` (pass-through for client components). The _browser side_ (session store, sign-in modal, header profile action) is the published `@timmbr/auth` package from timmbr-ds. Every zone mounts `<AuthModalHost />` next to `{children}` and uses `useProfileAction()` in its header, so sign-in opens in place on any page and calls the shell's same-origin routes. Zones read the httpOnly `timmbr_access_token` cookie (via `@timmbr/utils`) and redirect to `/?signin=1&returnTo=<path>` when timmbr-core answers 401. Wire types live in `@timmbr/auth/contract`, which the shell's handlers import too.
6. **Modern Rust-Powered Compiler Stack**: Standardized on Turbopack for local development, SWC for production compilation, and React Compiler for automatic component memoization.
7. **Design System vs Zone Code**:
   - **timmbr-ds** holds only generic building blocks and templates (`MediaCard`, `SubNav`, `Stepper`, `PageHeader`, `Price`, `Rating`, `NavHeader`…). They take display props and know nothing about products, orders or addresses.
   - **Zones** build feature components on top of them (`ProductCard` and `OrderLineItem` on `MediaCard`, `OrderTracker` on `Stepper`, `AddressCard` on `Card`). Zones also own the data fetching, the status mapping and all copy (`strings.ts`).
   - **Header profile menu:** the DS renders the generic `NavActionItem.menu`. `@timmbr/auth`'s `useProfileAction({ menuItems })` adds the session state and Log out. Each zone's `Header` supplies the links from its strings.
   - **Mobile:** the profile action is a plain link to `/account`, with no menu.
8. **Account Zone** (`/account`, port 3003):
   - **Pages:** `orders` (+ `[orderId]`), `wishlist`, `addresses`, `security`. They share the `(account)` layout (`AccountChrome`): `PageHeader` + `AccountNav` (`SubNav`) on desktop. `/account` is the overview: section cards on desktop and the **hub** on phones (a list of sections with summaries, plus Log out). On phones, section pages show only a "‹ Account" back link instead of the header and nav.
   - **Reads:** server components read timmbr-core directly (`lib/api/account.ts`). The session token comes from the cookie, a 401 redirects to sign-in, and `requireUser()` is cached per request.
   - **Changes:** client components send changes through the shell's `/api/core/*` (`lib/api/browser.ts`), then call `router.refresh()`.
   - **Session-changing actions** (change password, log out of all devices) use `@timmbr/auth`, served by the shell's `/api/auth/password/change` and `/api/auth/logout-all`.
   - **Create a password** (accounts without one) is a single dialog: a one-time code is sent on open, then `otp/verify` (intent `reset`) gives a setup token for `password/set`.
   - **Forms in overlays** (address, passwords) use the DS `ResponsiveDialog`: a centred dialog on desktop, a bottom sheet with pinned actions on phones.
   - **Addresses:** "Use my current location" pins the browser's position and fills empty fields through timmbr-core's `GET /geo/reverse` (Geoapify; the key stays in core).

---

## 2. Repository Layout

```text
timmbr-storefront/
├── .agents/                 # AI Coding Assistant Rules
│   └── rules.md             # Guidelines for agents
├── docs/                    # Central Platform Knowledge Base
│   ├── README.md            # Knowledge base index
│   ├── architecture/        # System design & multi-zone routing docs
│   └── conventions/         # Port allocations, env schemas, zone guides
├── zones/                   # Multi-Zone Applications Workspace
│   └── shell/               # Ingress router & domain control plane (Port 8000)
├── .env                     # Shared local development defaults (Port 8000)
├── .gitignore
├── pnpm-workspace.yaml      # Monorepo workspace definition (`zones/*`)
├── package.json             # Root workspace orchestration scripts
└── turbo.json               # Turborepo task pipeline
```

---

## 3. Toolchain & Compilers

- **Next.js 16.3.5**: Native App Router with Turbopack and React 19.
- **Turbopack**: Primary development bundler (`--turbopack`) with sub-second startup times and instant Fast Refresh.
- **React Compiler**: Enabled via `reactCompiler: true` in `next.config.ts`, automating component memoization.
- **Modern Edge Proxy**: Next.js 16 `proxy.ts` convention for edge security headers and correlation tracing.
