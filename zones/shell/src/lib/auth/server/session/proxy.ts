import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../constants";
import { buildSignInPath } from "@timmbr/auth/contract";
import { clientIpFrom } from "../core";
import {
  clearSessionCookies,
  readSessionTokens,
  setSessionCookies,
} from "./cookies";
import { authEnv } from "../env";
import { ensureFreshTokens } from "./refresh";

export interface SessionProxyOptions {
  /** Paths that require a session (redirect to sign-in otherwise). */
  protect?: (path: string) => boolean;
  /** Add headers to every response (security headers, tracing…). */
  decorate?: (response: NextResponse, request: NextRequest) => void;
}

/**
 * The shell's session proxy — the only place sessions are refreshed or gated.
 * Every request (including /products, /checkout, /account, which are then
 * rewritten to their zones) passes through it first.
 *
 * Checks are optimistic (cookie + token expiry). The real check is timmbr-core
 * rejecting a missing/expired token, which zones turn into a sign-in redirect.
 *
 * On refresh, the new tokens are written onto the request as well as the
 * response: Next applies these request headers before `next.config`
 * rewrites, so the zone rendering this request already receives them.
 */
export function createSessionProxy(options: SessionProxyOptions = {}) {
  return async function sessionProxy(
    request: NextRequest,
  ): Promise<NextResponse> {
    const tokens = readSessionTokens(request.cookies);
    const outcome = await ensureFreshTokens(
      tokens,
      clientIpFrom(request.headers),
    );

    if (outcome.status === "refreshed") {
      request.cookies.set(ACCESS_COOKIE, outcome.pair.accessToken);
      request.cookies.set(REFRESH_COOKIE, outcome.pair.refreshToken);
    } else if (outcome.status === "invalid") {
      request.cookies.delete(ACCESS_COOKIE);
      request.cookies.delete(REFRESH_COOKIE);
    }

    const signedIn =
      outcome.status === "fresh" ||
      outcome.status === "refreshed" ||
      // Core briefly unreachable: let the page decide via getSession()
      (outcome.status === "unavailable" && !!tokens.refreshToken);

    const { basePath, pathname, search } = request.nextUrl;
    const path = `${basePath}${pathname}`;

    let response: NextResponse;
    if (options.protect?.(path) && !signedIn) {
      const origin = authEnv().storefrontUrl ?? request.nextUrl.origin;
      response = NextResponse.redirect(
        new URL(buildSignInPath(`${path}${search}`), origin),
      );
    } else {
      response = NextResponse.next({ request: { headers: request.headers } });
    }

    if (outcome.status === "refreshed")
      setSessionCookies(response.cookies, outcome.pair);
    if (outcome.status === "invalid") clearSessionCookies(response.cookies);

    options.decorate?.(response, request);
    return response;
  };
}
