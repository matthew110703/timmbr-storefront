import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
    PRODUCTS_ZONE_URL: z.string().url().default("http://localhost:3001"),
    CHECKOUT_ZONE_URL: z.string().url().default("http://localhost:3002"),
    ACCOUNT_ZONE_URL: z.string().url().default("http://localhost:3003"),
    // Server-side sessions (BFF): only the shell holds the internal key
    CORE_API_URL: z.string().url().optional(),
    CORE_INTERNAL_KEY: z.string().min(32),
    STOREFRONT_URL: z.string().url().default("http://localhost:3000"),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1).default("localhost:3000"),
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    PRODUCTS_ZONE_URL: process.env.PRODUCTS_ZONE_URL,
    CHECKOUT_ZONE_URL: process.env.CHECKOUT_ZONE_URL,
    ACCOUNT_ZONE_URL: process.env.ACCOUNT_ZONE_URL,
    CORE_API_URL: process.env.CORE_API_URL,
    CORE_INTERNAL_KEY: process.env.CORE_INTERNAL_KEY,
    STOREFRONT_URL: process.env.STOREFRONT_URL,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
