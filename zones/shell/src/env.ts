import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
    AUTH_ZONE_URL: z.string().url().default("http://localhost:3001"),
    PRODUCTS_ZONE_URL: z.string().url().default("http://localhost:3002"),
    CHECKOUT_ZONE_URL: z.string().url().default("http://localhost:3003"),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1).default("localhost:3000"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    AUTH_ZONE_URL: process.env.AUTH_ZONE_URL,
    PRODUCTS_ZONE_URL: process.env.PRODUCTS_ZONE_URL,
    CHECKOUT_ZONE_URL: process.env.CHECKOUT_ZONE_URL,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
