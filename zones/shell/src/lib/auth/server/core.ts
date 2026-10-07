import { ApiError } from "@timmbr/utils";
import { authEnv } from "./env";

const INTERNAL_KEY_HEADER = "x-internal-key";
const CLIENT_IP_HEADER = "x-timmbr-client-ip";

export interface CoreRequest {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** User's access token, sent as a Bearer token. */
  accessToken?: string;
  /** End user's IP, so timmbr-core rate-limits per shopper (not per BFF). */
  clientIp?: string;
}

interface CoreEnvelope<T> {
  success?: boolean;
  data?: T;
  code?: string;
  message?: string;
}

/** Headers identifying the BFF (and the end user) to timmbr-core. */
export function trustedHeaders(clientIp?: string): Record<string, string> {
  const { internalKey } = authEnv();
  return {
    [INTERNAL_KEY_HEADER]: internalKey,
    ...(clientIp && { [CLIENT_IP_HEADER]: clientIp }),
  };
}

/**
 * Server-to-server call to timmbr-core's /api/v1 in trusted mode. Unwraps the
 * `{ success, data }` envelope; failures throw ApiError carrying core's body
 * (code, message, details) so route handlers can pass it straight through.
 */
export async function coreFetch<T>(
  path: string,
  request: CoreRequest = {},
): Promise<T> {
  const { coreApiUrl } = authEnv();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...trustedHeaders(request.clientIp),
  };
  if (request.body !== undefined) headers["Content-Type"] = "application/json";
  if (request.accessToken)
    headers.Authorization = `Bearer ${request.accessToken}`;

  let response: Response;
  try {
    response = await fetch(`${coreApiUrl}/api/v1${path}`, {
      method: request.method ?? "GET",
      headers,
      body:
        request.body === undefined ? undefined : JSON.stringify(request.body),
      cache: "no-store",
    });
  } catch (cause) {
    throw new ApiError(
      0,
      "Network error: Unable to connect to server",
      null,
      undefined,
      { cause },
    );
  }

  const text = await response.text();
  let json: CoreEnvelope<T> | null = null;
  try {
    json = text ? (JSON.parse(text) as CoreEnvelope<T>) : null;
  } catch {
    // Non-JSON body (e.g. a proxy error page); fall through with json = null.
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      json?.message ?? response.statusText,
      json,
      json?.code,
    );
  }
  return (json && "data" in json ? json.data : json) as T;
}

/** The end user's IP from the incoming request (first X-Forwarded-For hop). */
export function clientIpFrom(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? undefined;
}
