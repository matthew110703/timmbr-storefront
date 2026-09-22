# CI/CD Pipeline & Automated Verification

The `@timmbr` platform leverages GitHub Actions and Turborepo to enforce automated linting, type-checking, and build validation.

---

## 1. Zero-Hardcoding Dynamic Zone Discovery

The workflow located at [`.github/workflows/ci.yml`](file:///c:/Users/Nexus/Desktop/Coding%20Playground/projects/timmbr/timmbr-storefront/.github/workflows/ci.yml) does not hardcode any individual zone names (`shell`, etc.).

Instead, it relies on Turborepo's workspace graph to automatically detect all zones inside `zones/*`:

```yaml
# Pull Request Event: Evaluates changes relative to the PR's target branch (staging or main)
pnpm exec turbo run lint --filter="...[origin/${{ github.base_ref }}]"
pnpm exec turbo run check-types --filter="...[origin/${{ github.base_ref }}]"
pnpm exec turbo run build --filter="...[origin/${{ github.base_ref }}]"

# Push Event (main or staging): Runs across the entire monorepo
pnpm exec turbo run lint
pnpm exec turbo run check-types
pnpm exec turbo run build
```

When a developer creates a PR against `staging` or `main`, CI automatically computes changes against that target branch. When code is merged/pushed into `staging` or `main`, CI runs verification across all workspace zones.

---

## 2. Pipeline Steps

1. **Checkout**: Checks out git history with `fetch-depth: 0` so Turborepo can compute git diffs against `origin/main`.
2. **Setup pnpm & Node.js 22**: Caches the content-addressable pnpm store for ultra-fast installs.
3. **Install Dependencies**: `pnpm install --frozen-lockfile`.
4. **Lint**: Runs ESLint across active zones.
5. **Type Check**: Runs `tsc --noEmit` across active zones.
6. **Build**: Compiles production bundles via SWC and Turbopack.
