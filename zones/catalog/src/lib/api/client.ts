import { createApiClient } from "@timmbr/utils";
import { env } from "@/env";

/**
 * Server-side API client for the catalog zone. Catalog reads are public, so
 * calls pass `skipAuth` and the pages can stay cached.
 */
export const api = createApiClient({
  baseUrl: env.CORE_API_URL,
  apiPrefix: "/api/v1",
});

export { ApiError, isApiError } from "@timmbr/utils";
