# Architectural Rules for AI Agents (@timmbr platform)

1. **Workspace Layout**: Applications live strictly in `zones/`. Do NOT create local React component packages under `packages/`.
2. **UI & Theme Import**: Import all design system components exclusively from `@timmbr/ui` and `@timmbr/theme`.
3. **Cross-Zone Links**: NEVER use `next/link` for navigation across zone boundaries. Always use `CrossZoneLink` from `@timmbr/ui`.
4. **Secondary Zone Config**: Every secondary zone MUST configure `assetPrefix` and `basePath` in `next.config.ts`.
5. **Port Allocations**: Port `8000` is reserved for `zones/shell`. Subsequent zone applications MUST be allocated sequential ports starting from `8001`, `8002`, `8003`, etc.
6. **Environment Schema**: All environment variables MUST be validated in `src/env.ts` using `@t3-oss/env-nextjs` and Zod.
7. **Compiler & Bundler Standards**: Use Turbopack for dev, SWC for transpilation, and configure `"moduleResolution": "bundler"` in `tsconfig.json`.
8. **No Automatic Git Staging or Committing**: NEVER run `git add`, `git commit`, `git push`, or automatically stage/commit files. Staging and committing changes is strictly the user's prerogative unless explicitly requested.
9. **Co-located Static Strings (`strings.ts`)**: Every route/app level under `src/app/` (such as root `/`, `/home`, `/product`, etc.) MUST maintain a co-located `strings.ts` file holding all static UI strings, titles, descriptions, and labels for that segment. Never hardcode UI copy directly in page/layout components.
