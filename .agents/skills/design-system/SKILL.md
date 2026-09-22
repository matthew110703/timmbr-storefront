---
name: design-system
description: Mandatory rules, catalog reference, provider layering, and missing-component escalation protocol for the @timmbr design system.
---

# Timmbr Design System Consumption & Conventions

This skill provides comprehensive guidelines, component catalogues, and escalation workflows for building frontends across the `@timmbr` storefront platform.

---

## 1. Golden Rules of Design System Usage

1. **Exclusive Component Usage**:
   - Every visual element, layout container, button, form control, overlay, and feedback indicator MUST be imported from `@timmbr/ui`, `@timmbr/theme`, `@timmbr/motion`, `@timmbr/icons`, and `@timmbr/hooks`.
   - **Only Exception**: Dedicated, domain-specific app components (e.g. `ProductCard`, `CartDrawer`) that compose DS primitives.
2. **Missing Component Escalation Protocol**:
   - If an element or component is missing from the DS, **NEVER** arbitrarily create a custom HTML element or local ad-hoc UI component.
   - **Protocol**:
     1. Stop and notify the user immediately: _"Component `<X>` is not present in `@timmbr/ui`."_
     2. Provide a rationale and suggestion: _"Should this component be contributed to `@timmbr/ds` or should we use primitive composition `<Y>` with user approval?"_
     3. Await explicit user direction.
3. **Strict Consent for Visual Deviations**:
   - Changes outside the Design System tokens (specifically custom palette colors, themes, radius scales, or alternate layout philosophies) require explicit user consent.
4. **Co-located Strings (`strings.ts`)**:
   - Combine DS usage with Rule 9: Never hardcode button text, labels, or content inside DS components. Always import from `./strings`.

---

## 2. Package Architecture

| Package              | Purpose                              | Primary Exports / Primitives                                                                                                                                           |
| :------------------- | :----------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@timmbr/ui`**     | Component Library                    | `Container`, `Stack`, `Inline`, `Grid`, `Center`, `Button`, `Card`, `Badge`, `Heading`, `Text`, `Input`, `Dialog`, `Toast`, `DataList`, `Chip`, `TimmbrConfigProvider` |
| **`@timmbr/theme`**  | Design Tokens & Tailwind v4 `@theme` | Tokens (`colors`, `typography`, `radius`, `spacing`, `shadows`), `theme.css`                                                                                           |
| **`@timmbr/motion`** | Transitions & Layout Animations      | `motion`, `AnimatePresence`, `LayoutGroup`, transitions, variants, gestures                                                                                            |
| **`@timmbr/icons`**  | Icons & SVGs                         | `<Icon name="..." />`, `SpinnerIcon`, Lucide re-exports (`ArrowRight`, `Check`, `Sparkles`, etc.)                                                                      |
| **`@timmbr/hooks`**  | Shared React Hooks                   | `useMediaQuery`, `useControllableState`, `useMounted`                                                                                                                  |

---

## 3. Component Catalog Quick Reference

### Layout Primitives

- **`Container`**: Max-width wrapper (`maxWidth="sm" | "md" | "lg" | "xl" | "2xl" | "full"`).
- **`Stack`**: Vertical flex layout with tokenized `gap` (`1` to `24`), `align`, and optional `divider`.
- **`Inline`**: Horizontal flex layout with wrapping, tokenized `gap`, and optional `divider`.
- **`Grid`**: CSS grid with responsive `cols` (`1` to `12`), `autoFit`, `minChildWidth`, and `gap`.
- **`Center`**: Centering container along vertical and horizontal axes.

### Data & Display

- **`Heading`**: Headings (`level={1 | 2 | 3 | 4 | 5 | 6}`, `font="display" | "title"`).
- **`Text`**: Body typography (`variant="body-1" | "body-2" | "body-3" | "subtitle-1"`, `foreground="default" | "muted" | "subtle" | "primary"`).
- **`Button`**: Interactive button (`variant="default" | "outline" | "ghost" | "destructive"`, `size="default" | "sm" | "lg" | "icon"`, supports `asChild`, `loading`, `leftIcon`, `rightIcon`).
- **`Badge`**: Status indicator (`variant="primary" | "brand" | "outline" | "subtle" | "success" | "destructive"`, `dot={true}`).
- **`Card`**: Card surface (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- **`DataList`**: Key-value data display with divider and icon support.

---

## 4. Radix `asChild` Composition

Whenever combining interactive components with Next.js navigation or anchors, use the `asChild` prop from Radix UI:

```tsx
import { Button } from "@timmbr/ui";

// Correct composition with an anchor or custom zone link:
<Button variant="default" size="lg" asChild>
  <a href="/health" target="_blank" rel="noopener noreferrer">
    <span>Liveness Probe</span>
  </a>
</Button>;
```

---

## 5. App Setup & Configuration Layering

In each zone application (`zones/<zone>`):

1. **Root Layout Provider**:
   Wrap the application body inside `<TimmbrConfigProvider>` from `@timmbr/ui`.
2. **Tailwind CSS v4 & Theme**:
   In `src/app/globals.css`:
   ```css
   @import "tailwindcss";
   @import "@timmbr/theme/theme.css";

   @source "../../../../node_modules/@timmbr/ui/dist";
   ```
3. **Transpilation**:
   In `next.config.ts`:
   ```ts
   transpilePackages: [
     '@timmbr/ui',
     '@timmbr/theme',
     '@timmbr/motion',
     '@timmbr/icons',
     '@timmbr/hooks',
     '@timmbr/utils',
   ],
   ```

---

## 6. Local Development Linking Commands

When developing features in parallel with the Design System repository located at `../timmbr-ds`:

- **Check Link Status**:

  ```bash
  pnpm ds:status
  ```

  Shows whether each package is pulling from the live NPM registry or linked to `../timmbr-ds/packages/*`.

- **Link Local Design System**:

  ```bash
  pnpm ds:link
  ```

  Automatically links all packages from `../timmbr-ds/packages/` into all active zones.

- **Unlink & Restore Registry**:
  ```bash
  pnpm ds:unlink
  ```
  Unlinks local packages across all zones and executes `pnpm install` to restore published NPM registry versions.
