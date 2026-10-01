# Architectural & Operational Rules for AI Agents (@timmbr platform)

1. **Workspace Layout**: Applications live strictly in `zones/`. Do NOT create local React component packages under `packages/`.
2. **UI & Theme Import**: Import all design system components exclusively from `@timmbr/ui`, `@timmbr/theme`, `@timmbr/motion`, `@timmbr/icons`, and `@timmbr/hooks`.
3. **Cross-Zone Links**: NEVER use `next/link` for navigation across zone boundaries. Always use `CrossZoneLink` from `@timmbr/ui` or standard HTML `<a>` tags.
4. **Secondary Zone Config**: Every secondary zone MUST configure `assetPrefix` and `basePath` in `next.config.ts`.
5. **Port Allocations**: Port `3000` is reserved for `zones/shell`. Subsequent zone applications MUST be allocated sequential ports starting from `3001` (`zones/home`), `3002`, `3003`, etc.
6. **Environment Schema**: All environment variables MUST be validated in `src/env.ts` using `@t3-oss/env-nextjs` and Zod.
7. **Compiler & Bundler Standards**: Use Turbopack for dev, SWC for transpilation, and configure `"moduleResolution": "bundler"` in `tsconfig.json`.
8. **No Automatic Git Staging or Committing**: NEVER run `git add`, `git commit`, `git push`, or automatically stage/commit files. Staging and committing changes is strictly the user's prerogative unless explicitly requested.
9. **Co-located Static Strings (`strings.ts`)**: Every route/app level under `src/app/` (such as root `/`, `/home`, `/product`, etc.) MUST maintain a co-located `strings.ts` file holding all static UI strings, titles, descriptions, and labels for that segment. Never hardcode UI copy directly in page/layout components.
10. **Strict Design System Consumption (Component-First Hierarchy)**:
    - **First Priority**: Before writing any UI markup, ALWAYS check `@timmbr/ui` to verify if a matching component exists (`Container`, `Center`, `Stack`, `Inline`, `Card`, `Heading`, `Text`, `Button`, `Input`, `Alert`, `Badge`, `Dropdown`, `Dialog`, `Table`, etc.).
    - **Mandatory Layout Containers**: Every layout file (`layout.tsx`) MUST wrap its main content with `@timmbr/ui`'s `Container` primitive.
    - **Layout Primitives over Flex/Div**: Use `Center`, `Stack`, and `Inline` for layout alignment, centering, and vertical/horizontal rhythm instead of raw `flex`, `items-center`, `justify-center`, or wrapper `div`s.
    - Always use `@timmbr/ui` primitives instead of native HTML elements (`<div>`, `<h1>`-`<h6>`, `<p>`, `<button>`, `<input>`) for cards/surfaces, typography, form controls, and layout stacks.
    - Native HTML elements are ONLY permitted for semantic tags (like `<form>`, `<main>`, `<nav>`) or when no suitable primitive exists.
11. **Missing Component Protocol**:
    - If an element or component is not present in `@timmbr/ui`, NEVER build an ad-hoc replacement. Flag it immediately to the user, explain why it is missing, and provide concrete suggestions on whether it should be contributed to `@timmbr/ds` or composed with explicit consent.
12. **Consent Required for Design Changes**:
    - Colors, typography scales, radius values, and layout tokens must strictly follow `@timmbr/theme`. Any changes or departures strictly require explicit user consent.
13. **Root-Level `src/components/` (No Components inside `app/`)**:
    - All custom application components (e.g. `ProductCard`, `CartDrawer`) MUST live at the root `src/components/` level inside that zone application (`zones/<zone>/src/components/`).
    - NEVER create or maintain `components/` folders inside `src/app/` or any route segment. Route directories under `src/app/` are strictly reserved for App Router primitives (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`) and co-located `strings.ts`.
14. **Form Handling & Validation (`validationSchema.ts`)**:
    - Standardize client-side forms on `react-hook-form` + `zod` for type-safe validation.
    - Validation schemas and resolvers MUST live in a co-located `validationSchema.ts` file in the same folder as the form component.
15. **Motion Animations First, Vanilla CSS Fallback**:
    - Centralize all motion animations and spring physics inside `@timmbr/motion`. Consuming applications MUST only consume from `@timmbr/motion`.
    - Provide clean vanilla CSS fallbacks when motion is disabled or for reduced-motion preferences.
16. **Design System Linking via Yalc**:
    - For local development with `../timmbr-ds`, use `pnpm ds:link` (powered by Yalc) to preserve Next.js Turbopack compatibility. Never use raw `pnpm link` pointing outside the workspace.
17. **Cookie Handling Boundaries**:
    - Use `await cookies()` from `next/headers` on the server (`proxy.ts`, server layouts) and `js-cookie` in client components. Never import `cookies` from `next/headers` into client-side code (`"use client"`).
