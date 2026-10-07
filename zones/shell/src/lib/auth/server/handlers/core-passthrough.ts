import { NextResponse, type NextRequest } from "next/server";
import { clientIpFrom, trustedHeaders } from "../core";
import { authEnv } from "../env";
import { csrfRejected, fail, isSameOrigin, withCookies } from "../http";
import { freshSessionTokens } from "../session/refresh";

const FORWARDED_REQUEST_HEADERS = ["accept", "content-type", "accept-language"];
const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "cache-control",
  "etag",
  "retry-after",
];

/**
 * `/api/core/*`: pass-through for Client Components. Forwards to timmbr-core
 * with the session's access token. Auth endpoints are excluded — in trusted
 * mode they return tokens, which must never reach the browser (use
 * /api/auth/* instead).
 */
export async function corePassthrough(
  request: NextRequest,
  path: string[],
): Promise<NextResponse> {
  if (path.length === 0 || path[0] === "auth") {
    return fail(404, "NOT_FOUND", "Not found.");
  }
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && !isSameOrigin(request))
    return csrfRejected();

  const cookieUpdates = new NextResponse(null);
  const { accessToken } = await freshSessionTokens(request, cookieUpdates);

  const headers = new Headers(trustedHeaders(clientIpFrom(request.headers)));
  FORWARDED_REQUEST_HEADERS.forEach((name) => {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  });
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  const target = `${authEnv().coreApiUrl}/api/v1/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body:
        method === "GET" || method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
    });
  } catch {
    return withCookies(
      fail(
        503,
        "CORE_UNAVAILABLE",
        "Service temporarily unavailable. Please try again.",
      ),
      cookieUpdates,
    );
  }

  const responseHeaders = new Headers();
  FORWARDED_RESPONSE_HEADERS.forEach((name) => {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  });
  // Upstream Set-Cookie (API-domain cookies) is intentionally dropped.
  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
  return withCookies(response, cookieUpdates);
}
