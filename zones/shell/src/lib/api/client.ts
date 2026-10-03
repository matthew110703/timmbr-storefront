import { createApiClient } from "@timmbr/utils";
import { env } from "@/env";

/**
 * Initialized API client configured for Shell zone application.
 * Pre-configured with NEXT_PUBLIC_API_URL, /api/v1 prefix, and 60s default ISR revalidation.
 */
export const api = createApiClient({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  apiPrefix: "/api/v1",
  defaultRevalidate: 60,
});

export { ApiError } from "@timmbr/utils";
export type {
  RequestOptions,
  ApiClientConfig,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginatedResult,
  PaginationMeta,
} from "@timmbr/utils";
