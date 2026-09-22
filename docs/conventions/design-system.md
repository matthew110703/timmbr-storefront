# Design System Architecture & Consumption Guidelines

The `@timmbr` storefront platform standardizes its entire user interface on the **Timmbr Design System** (`timmbr-ds`). All visual styling, tokens, interactive components, motion choreography, and layout primitives are provided by centralized packages.

---

## 1. Core Packages

| Package              | Version      | Description                                                                                     |
| :------------------- | :----------- | :---------------------------------------------------------------------------------------------- |
| **`@timmbr/ui`**     | `1.0.0-beta` | Core React component library (Layout, Display, Forms, Overlays, Feedback).                      |
| **`@timmbr/theme`**  | `1.0.0-beta` | Design tokens, CSS variables, and Tailwind CSS v4 `@theme` definitions (`theme.css`).           |
| **`@timmbr/motion`** | `1.0.0-beta` | Physics-based transitions, variants, presence, and motion primitives powered by `motion/react`. |
| **`@timmbr/icons`**  | `1.0.0-beta` | Unified Lucide and custom SVG icon system.                                                      |
| **`@timmbr/hooks`**  | `1.0.0-beta` | Pure React hooks for UI states and responsive queries.                                          |

Living Storybook reference: [https://timmbr-ds-storybook.vercel.app](https://timmbr-ds-storybook.vercel.app/?path=/story/overview-home--overview)

---

## 2. Fundamental Consumption Rules

1. **No Ad-Hoc Components**:
   - In all frontend applications under `zones/`, any element, container, button, tag, or dialog must come from `@timmbr/ui`.
   - Never write custom ad-hoc styled tags when a design system component exists.
   - The only exception is dedicated domain-level composite components (e.g., `ProductCard`, `OrderSummary`) that assemble DS primitives.
2. **Missing Component Escalation Protocol**:
   - If a needed component or element is not available in the design system, **do not build an unapproved substitute**.
   - Flag the missing element to the user immediately, explain what is needed, and offer suggestions on whether it should be contributed to `@timmbr/ds`.
3. **Strict Consent for Visual / Theme Deviations**:
   - Colors, typography scales, radius values, and layout models must follow `@timmbr/theme`. Any changes or departures strictly require explicit user consent.
4. **Co-located Strings Integration**:
   - Comply with Rule 9: static text rendered inside design system components must always be sourced from the segment's co-located `strings.ts`.

---

## 3. Configuration & Next.js App Router Integration

### Provider Layering

In each zone's root layout (`src/app/layout.tsx`), wrap the DOM tree with `<TimmbrConfigProvider>`:

```tsx
import { TimmbrConfigProvider } from "@timmbr/ui";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TimmbrConfigProvider>{children}</TimmbrConfigProvider>
      </body>
    </html>
  );
}
```

### Tailwind CSS v4 Theme Import

Consuming applications configure Tailwind CSS v4 via `@tailwindcss/postcss`. In `src/app/globals.css`:

```css
@import "tailwindcss";
@import "@timmbr/theme/theme.css";

@source "../../../../node_modules/@timmbr/ui/dist";
```

### Transpilation

Each zone's `next.config.ts` must configure `transpilePackages`:

```ts
const nextConfig: NextConfig = {
  transpilePackages: [
    "@timmbr/ui",
    "@timmbr/theme",
    "@timmbr/motion",
    "@timmbr/icons",
    "@timmbr/hooks",
    "@timmbr/utils",
  ],
  // ...
};
```

---

## 4. Local Development Linking Strategy (`../timmbr-ds`)

When iterating on the Design System repository concurrently, the platform uses **`yalc`** for local package linking.

Unlike raw symlinks (which cause Turbopack to panic with `leaves the filesystem root` errors), `yalc` publishes build outputs into a local store and injects isolated `.yalc/` copies into consumer projects. This guarantees complete compatibility with **Turbopack**, **SWC**, and **Next.js Fast Refresh**.

### Workflow Commands in `timmbr-storefront`:

| Command          | Action                                                                                                            |
| :--------------- | :---------------------------------------------------------------------------------------------------------------- |
| `pnpm ds:status` | Inspect all zones and report whether each `@timmbr/*` package is using **Registry (npm)** or **Yalc Local Link**. |
| `pnpm ds:link`   | Publishes all DS packages into the local Yalc store and links them into all zones in `zones/`.                    |
| `pnpm ds:unlink` | Unlinks all Yalc packages across all zones, cleans `.yalc/` directories, and restores published NPM packages.     |

### Making Subsequent Edits in `timmbr-ds`:

Once linked with `pnpm ds:link`, you **do not** need to re-link storefront when you edit the Design System. Simply push updates from `timmbr-ds`:

```bash
# In timmbr-ds/
pnpm yalc:push          # Rebuilds and pushes all packages to all consuming apps
pnpm yalc:push ui       # Rebuilds and pushes @timmbr/ui only
pnpm yalc:push theme    # Rebuilds and pushes @timmbr/theme only
```

Next.js Turbopack will immediately detect the updated files in `.yalc/` and trigger Fast Refresh in your active browser session.

The design system repository path defaults to `../timmbr-ds` relative to the monorepo root, or can be overridden via `TIMMBR_DS_PATH`.
