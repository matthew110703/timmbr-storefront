import { createApiClient } from "@timmbr/utils";
import { env } from "@/env";

/**
 * Server-side API client for the catalog zone. Catalog reads are public, so
 * calls pass `skipAuth` and the pages can stay cached.
 */
export const api = createApiClient({
  baseUrl: env.CORE_API_URL,
  apiPrefix: "/api/v1",
  // Marks this server as a trusted storefront client (no per-IP rate limit on catalog reads).
  ...(env.CORE_INTERNAL_KEY && {
    defaultHeaders: { "x-internal-key": env.CORE_INTERNAL_KEY },
  }),
});

export { ApiError, isApiError } from "@timmbr/utils";
