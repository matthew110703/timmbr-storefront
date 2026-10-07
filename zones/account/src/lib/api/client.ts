import { createApiClient } from "@timmbr/utils";
import { env } from "@/env";

/**
 * Server-side API client for the account zone. On the server, @timmbr/utils
 * attaches the session's access token from the `timmbr_access_token` cookie
 * automatically. The shell keeps that cookie fresh; this zone has no auth code.
 */
export const api = createApiClient({
  baseUrl: env.CORE_API_URL,
  apiPrefix: "/api/v1",
});

export { ApiError, isApiError } from "@timmbr/utils";
