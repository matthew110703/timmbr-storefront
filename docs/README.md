# @timmbr Platform Knowledge Base & Documentation

Welcome to the central documentation hub for the **@timmbr** storefront and multi-zone platform.

---

## 📚 Table of Contents

### 1. Architecture

- **[System Design & Architecture](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/architecture/system-design.md)**: Master architecture contract, technical stack, core principles, and monorepo layout.
- **[Multi-Zone Routing & Ingress Proxy](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/architecture/multi-zone-routing.md)**: How native Next.js URL rewrites and edge proxying connect decoupled zone applications under a single unified domain.
- **[CI/CD Pipeline](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/architecture/ci-cd.md)**: Automated verification with dynamic multi-zone change detection.

### 2. Standards & Conventions

- **[Design System Guidelines](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/design-system.md)**: Consumption standards, Tailwind v4 setup, provider layering, and missing-component escalation for `@timmbr/*` packages.
- **[Port Allocation Convention](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/ports.md)**: Standard port numbering across the monorepo (`shell: 8000`, secondary zones: `8001`, `8002`, ...).
- **[Environment Strategy](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/environment.md)**: Cascading `.env` hierarchy and type-safe Zod runtime schema validation.
- **[Static Strings Convention](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/strings.md)**: Co-located `strings.ts` files across all route segments for centralized static UI copy.
- **[Testing Strategy](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/testing.md)**: Vitest unit testing and Playwright cross-zone E2E tests.
- **[Zone Application Guidelines](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/docs/conventions/zones.md)**: Structure, requirements (`assetPrefix`, `basePath`), and conventions for creating new zone applications.

---

## 🚀 Quick Command Reference

| Command            | Action                                                          |
| ------------------ | --------------------------------------------------------------- |
| `pnpm install`     | Install dependencies across all workspace packages              |
| `pnpm dev`         | Boot shell host (or `pnpm dev [zones...]` with secondary zones) |
| `pnpm dev:all`     | Boot shell + all secondary zones concurrently                   |
| `pnpm build`       | Build all zone applications with SWC & Turbopack                |
| `pnpm check-types` | Run TypeScript type checking across all workspace packages      |
| `pnpm lint`        | Run ESLint across workspace packages                            |
| `pnpm test`        | Run Vitest unit tests across zone applications                  |
| `pnpm test:e2e`    | Run Playwright cross-zone integration tests                     |
