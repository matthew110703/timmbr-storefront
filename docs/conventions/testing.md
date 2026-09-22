# Testing Strategy & Conventions

The platform uses a two-tiered testing approach: **Vitest** for fast unit/component testing within individual zones, and **Playwright** for cross-zone end-to-end integration tests.

---

## 1. Unit & Component Testing (Vitest)

Each zone maintains a `vitest.config.ts` configured with `jsdom` and `@vitejs/plugin-react`:

- **Location**: Co-located alongside components (e.g. `src/app/page.test.tsx` or `src/features/<feature>/components/<component>.test.tsx`).
- **Commands**:
  - Run all zone tests: `pnpm test`
  - Run specific zone test: `pnpm --filter shell test`

### Example Test

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./page";
import { strings } from "./strings";

describe("HomePage", () => {
  it("renders heading from strings.ts", () => {
    render(<HomePage />);
    expect(screen.getByText(strings.hero.title)).toBeInTheDocument();
  });
});
```

---

## 2. End-to-End Integration Testing (Playwright)

Cross-zone routing, edge headers, and full-page workflows are tested using Playwright:

- **Location**: Root `e2e/` folder.
- **Config**: `playwright.config.ts`.
- **Command**: `pnpm test:e2e`
- **Target**: Boots `pnpm dev` automatically and tests against `http://localhost:8000`.
