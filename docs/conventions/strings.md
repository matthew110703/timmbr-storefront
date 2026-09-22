# Static Strings Convention (`strings.ts`)

To ensure maintainability, content portability, and future localization readiness, the `@timmbr` platform enforces co-located `strings.ts` files across all application route segments.

---

## 1. Golden Rule

> **Never hardcode static user-facing strings directly in components or JSX.**

All text constants—including page titles, meta descriptions, button labels, headings, and help text—must reside in a co-located `strings.ts` file at the corresponding route segment.

---

## 2. Co-location Convention

```text
src/app/
├── strings.ts                 # Root level copy (global navbar, footer, metadata, homepage)
├── layout.tsx
├── page.tsx
├── home/
│   ├── strings.ts             # Copy specific to /home
│   └── page.tsx
├── product/
│   ├── strings.ts             # Copy specific to /product
│   ├── page.tsx
│   └── [id]/
│       ├── strings.ts         # Copy specific to /product/:id
│       └── page.tsx
```

---

## 3. Standard Implementation Pattern

### `strings.ts`

```typescript
export const strings = {
  metadata: {
    title: "Storefront Shell | @timmbr",
    description: "High-performance Next.js 16 Multi-Zone Architecture.",
  },
  hero: {
    pill: "Ingress Control Plane Online · Port 8000",
    title: "Storefront Shell",
    titleAccent: "@timmbr Platform",
    description: "The central domain control plane and ingress router.",
    ctaProbe: "⚡ Check Liveness Probe",
  },
} as const;

export type AppStrings = typeof strings;
```

### Component Consumption

```tsx
import { strings } from "./strings";

export default function Page() {
  return (
    <section>
      <h1>{strings.hero.title}</h1>
      <p>{strings.hero.description}</p>
    </section>
  );
}
```
