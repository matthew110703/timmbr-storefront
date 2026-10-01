# Design System Architecture & Consumption Guidelines

The `@timmbr` storefront platform standardizes its entire user interface on the **Timmbr Design System** (`timmbr-ds`). All visual styling, tokens, interactive components, motion choreography, and layout primitives are provided by centralized packages.

---

## 1. Core Packages

| Package              | Version       | Description                                                                                     |
| :------------------- | :------------ | :---------------------------------------------------------------------------------------------- |
| **`@timmbr/ui`**     | `^1.2.0`      | Core React component library (Layout, Display, Forms, Overlays, Feedback, Data).                |
| **`@timmbr/theme`**  | `^1.1.0`      | Design tokens, CSS variables, and Tailwind CSS v4 `@theme` definitions (`theme.css`).           |
| **`@timmbr/motion`** | `^1.1.0`      | Physics-based transitions, variants, presence, and motion primitives powered by `motion/react`. |
| **`@timmbr/icons`**  | `^1.2.0`      | Unified Lucide and custom SVG icon system.                                                      |
| **`@timmbr/hooks`**  | `^1.0.0-beta` | Pure React hooks for UI states and responsive queries.                                          |
| **`@timmbr/utils`**  | `^1.1.0`      | Shared styling utilities, class merging (`cn`), and helper functions.                           |

Living Storybook reference: [https://timmbr-ds-storybook.vercel.app](https://timmbr-ds-storybook.vercel.app/?path=/story/overview-home--overview)

---

## 2. Fundamental Consumption Rules

### Rule 1: Component-First Hierarchy (Inspect Design System First)

- **First Priority**: Before writing ANY UI markup, always inspect `@timmbr/ui` to verify if an existing primitive matches the requirement.
- Never write ad-hoc styled HTML tags (`<button className="...">`, `<input className="...">`, `<div className="card">`, `<h1>`, `<p>`) when a design system primitive exists.
- Native HTML elements are ONLY permitted for semantic wrappers (such as `<form>`, `<main>`, `<nav>`) or when no suitable primitive exists.
- Supported primitives include:
  - **Layout**: `Container`, `Grid`, `Center`, `Stack`, `Inline`
  - **Form**: `Input`, `Textarea`, `Select`, `Radio`, `Checkbox`, `Switch`, `RangeSlider`, `Label`, `FormField`, `ImageUpload`
  - **Display**: `Button`, `LinkButton`, `Badge`, `Card`, `Avatar`, `Divider`, `Heading`, `Text`, `Chip`, `Stat`, `Accordion`
  - **Feedback**: `Alert`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`
  - **Overlays**: `Dialog`, `Drawer`, `Dropdown`, `Popover`, `Toast`, `Tooltip`, `Tabs`, `SideBarNavigation`
  - **Data**: `Table`, `Pagination`, `DataList`, `List`

### Rule 2: Mandatory Layout Containers

- Every layout file (`layout.tsx`) MUST wrap its main content with `@timmbr/ui`'s `Container` primitive.
- Use `Center`, `Stack`, and `Inline` for layout rhythm and centering instead of raw `flex` or wrapper `div`s.

### Rule 3: Missing Component Escalation Protocol

- If a required UI component is not available in `@timmbr/ui`, **never build an unapproved local substitute**.
- Immediately notify the user, describe the requirement, and evaluate whether it should be:
  1. Contributed upstream to `@timmbr/ds`, or
  2. Composed cleanly from existing primitives with explicit design approval.

### Rule 4: Strict Consent for Visual & Token Deviations

- Colors, typography scales, elevation shadows, radius tokens, and spacing scales must strictly adhere to `@timmbr/theme`.
- Any visual styling outside token definitions requires explicit user consent.

### Rule 5: Motion Animations First, Vanilla CSS Fallback

- Centralize all motion animations, spring physics, and variants inside `@timmbr/motion`. Consuming applications MUST only consume from `@timmbr/motion`.
- Provide clean vanilla CSS fallbacks when motion is disabled or for reduced-motion preferences.

### Rule 6: Co-located Strings Integration

- Static text rendered inside components must always be sourced from the route's co-located `strings.ts`.

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
    <html lang="en" data-theme="light">
      <body>
        <TimmbrConfigProvider config={{ theme: { mode: "light" } }}>
          {children}
        </TimmbrConfigProvider>
      </body>
    </html>
  );
}
```

### Tailwind CSS v4 Theme Import

Consuming applications configure Tailwind CSS v4 in `src/app/globals.css`:

```css
@import "tailwindcss";
@import "@timmbr/theme/theme.css";

@source "../../node_modules/@timmbr/ui/dist";
@source "../../.yalc/@timmbr/ui/dist";
@source "../../node_modules/@timmbr/icons/dist";
@source "../../.yalc/@timmbr/icons/dist";
@source "./**/*.{js,ts,jsx,tsx}";
@source "../components/**/*.{js,ts,jsx,tsx}";
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
