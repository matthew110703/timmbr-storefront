# Environment Variable Strategy & Schema Validation

To guarantee stability and prevent misconfigurations, environment variables are organized into a strict cascading hierarchy and validated at runtime with Zod.

---

## 1. Cascading Hierarchy

1. **Root `.env`**: Committed default local development variables. Inherited by local processes.
2. **Zone-level `.env.local`**: Git-ignored secrets specific to individual zone applications.
3. **Production Cloud Deployments**: Variables are configured directly in hosting environments without relying on root `.env`.

---

## 2. Type-Safe Schema Validation

Every zone application must validate its environment variables using `@t3-oss/env-nextjs` and `zod` in `src/env.ts`.

Example:

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(8000),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1).default("localhost:8000"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```
