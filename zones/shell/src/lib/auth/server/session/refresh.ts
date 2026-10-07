import type { NextRequest, NextResponse } from "next/server";
import { isApiError, parseJwt } from "@timmbr/utils";
import { REFRESH_BEFORE_EXPIRY_S } from "../constants";
import type { TokenPair } from "../types";
import { clientIpFrom, coreFetch } from "../core";
import {
  clearSessionCookies,
  readSessionTokens,
  setSessionCookies,
} from "./cookies";

/**
 * Optimistic freshness check: reads `exp` without verifying the signature
 * (no secret on the storefront). timmbr-core verifies on every real call.
 */
export function isAccessTokenFresh(
  token: string | undefined,
  now = Date.now(),
): boolean {
  const exp = token ? parseJwt<{ exp?: number }>(token)?.exp : undefined;
  return (
    typeof exp === "number" && exp * 1000 - now > REFRESH_BEFORE_EXPIRY_S * 1000
  );
}

export type RefreshOutcome =
  | { status: "fresh" }
  | { status: "refreshed"; pair: TokenPair }
  /** The refresh token was rejected: the session is over, clear cookies. */
  | { status: "invalid" }
  /** Core unreachable / 5xx: keep cookies, retry on the next request. */
  | { status: "unavailable" }
  | { status: "anonymous" };

/**
 * Keep a session alive: refresh when the access token is missing or about to
 * expire. Concurrent refreshes with the same token are safe — timmbr-core
 * returns the same new pair within its grace window.
 */
export async function ensureFreshTokens(
  tokens: Partial<TokenPair>,
  clientIp?: string,
): Promise<RefreshOutcome> {
  if (isAccessTokenFresh(tokens.accessToken)) return { status: "fresh" };
  if (!tokens.refreshToken) return { status: "anonymous" };

  try {
    const pair = await coreFetch<TokenPair>("/auth/refresh", {
      method: "POST",
      body: { refreshToken: tokens.refreshToken },
      clientIp,
    });
    return { status: "refreshed", pair };
  } catch (error) {
    const rejected =
      isApiError(error) &&
      (error.statusCode === 401 || error.statusCode === 403);
    return { status: rejected ? "invalid" : "unavailable" };
  }
}

/**
 * Current tokens for a route handler. Routes under /api aren't covered by the
 * session proxy, so they refresh here when needed; cookie updates are written
 * onto `cookieUpdates` (merge them into the final response with `withCookies`).
 */
export async function freshSessionTokens(
  request: NextRequest,
  cookieUpdates: NextResponse,
): Promise<Partial<TokenPair>> {
  const tokens = readSessionTokens(request.cookies);
  const outcome = await ensureFreshTokens(
    tokens,
    clientIpFrom(request.headers),
  );

  switch (outcome.status) {
    case "refreshed":
      setSessionCookies(cookieUpdates.cookies, outcome.pair);
      return outcome.pair;
    case "invalid":
      clearSessionCookies(cookieUpdates.cookies);
      return {};
    case "fresh":
    case "unavailable":
      return tokens;
    default:
      return {};
  }
}
