---
name: strings-management
description: Guidelines and patterns for maintaining co-located strings.ts files across all route/app levels in the @timmbr platform.
---

# Co-located Strings Management (`strings.ts`)

In the `@timmbr` multi-zone architecture, all user-facing static copy, labels, headings, error messages, and descriptions must be extracted into co-located `strings.ts` files at each app/route level.

---

## Core Principle

**Zero Hardcoded Strings in Components**:
Never hardcode UI copy, button text, page titles, or descriptions directly inside `page.tsx`, `layout.tsx`, or feature components.

---

## Directory Pattern

Every route segment in `src/app/` must have a co-located `strings.ts` alongside its `page.tsx` or `layout.tsx`:

```text
src/app/
├── strings.ts                 # Root level copy (global navbar, footer, metadata, homepage)
├── layout.tsx                 # Imports from ./strings
├── page.tsx                   # Imports from ./strings
├── home/
│   ├── strings.ts             # /home specific copy
│   └── page.tsx               # Imports from ./strings
├── product/
│   ├── strings.ts             # /product catalog copy
│   ├── page.tsx               # Imports from ./strings
│   └── [id]/
│       ├── strings.ts         # /product/:id PDP copy
│       └── page.tsx           # Imports from ./strings
```

---

## File Structure (`strings.ts`)

Use `as const` for strict type safety and autocompletion:

```typescript
export const strings = {
  metadata: {
    title: "Page Title | @timmbr",
    description: "Page description...",
  },
  hero: {
    pill: "New Feature Available",
    title: "Headline Text",
    titleAccent: "Highlighted Accent Text",
    description: "Detailed introductory paragraph...",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
  },
  sections: {
    // Section-specific copy...
  },
  errors: {
    notFound: "The requested resource was not found.",
  },
} as const;

export type AppStrings = typeof strings;
```

---

## Component Consumption

In `page.tsx` or `layout.tsx`:

```tsx
import { strings } from "./strings";

export default function Page() {
  return (
    <div>
      <h1>{strings.hero.title}</h1>
      <p>{strings.hero.description}</p>
      <button>{strings.hero.ctaPrimary}</button>
    </div>
  );
}
```

---

## Benefits

1. **Separation of Concerns**: Content/copy can be revised without touching component logic or JSX structure.
2. **Localization Readiness**: Simple transition to i18n/translation frameworks when internationalization is added.
3. **Type Safety & Refactoring**: TypeScript catches missing or renamed strings at compile time.
