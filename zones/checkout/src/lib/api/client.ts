import { createApiClient } from "@timmbr/utils";
import { env } from "@/env";

/** Server-side API client for the checkout zone (signed-in reads; pass the session token per call). */
export const api = createApiClient({
  baseUrl: env.CORE_API_URL,
  apiPrefix: "/api/v1",
});

export { ApiError, isApiError } from "@timmbr/utils";
