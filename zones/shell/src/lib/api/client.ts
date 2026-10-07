import { createApiClient } from "@timmbr/utils";
import { env } from "@/env";

const isBrowser = typeof window !== "undefined";

/**
 * Shared API client for the shell zone.
 *
 * - Browser: requests go through the BFF pass-through (`/api/core/*`), which
 *   adds the session's token from the httpOnly cookie. No token in JS.
 * - Server: public data (CMS, catalog) is fetched from timmbr-core directly
 *   with 60s ISR. On the server, @timmbr/utils also attaches the session
 *   token from the `timmbr_access_token` cookie when one is present.
 */
export const api = createApiClient(
  isBrowser
    ? { baseUrl: "", apiPrefix: "/api/core", defaultRevalidate: 60 }
    : {
        baseUrl: env.NEXT_PUBLIC_API_URL,
        apiPrefix: "/api/v1",
        defaultRevalidate: 60,
      },
);

export { ApiError } from "@timmbr/utils";
export type {
  RequestOptions,
  ApiClientConfig,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginatedResult,
  PaginationMeta,
} from "@timmbr/utils";
