import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(3001),
    // timmbr-core, as reachable from this zone's server
    CORE_API_URL: z.string().url().default("http://localhost:8000"),
    // Shared key that marks this server as a trusted storefront client: core then skips rate
    // limiting on its public catalog reads (otherwise every shopper shares this server's IP).
    CORE_INTERNAL_KEY: z.string().min(32).optional(),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1).default("localhost:3000"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CORE_API_URL: process.env.CORE_API_URL,
    CORE_INTERNAL_KEY: process.env.CORE_INTERNAL_KEY,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
