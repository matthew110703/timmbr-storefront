import { parseJwt } from "@timmbr/utils";
import {
  ACCESS_COOKIE,
  OAUTH_BIND_COOKIE,
  OAUTH_BIND_MAX_AGE_S,
  REFRESH_COOKIE,
} from "../constants";
import type { TokenPair } from "../types";
import { authEnv } from "../env";

/**
 * The subset of cookie APIs we need. Satisfied by `NextResponse.cookies`,
 * `NextRequest.cookies` and `await cookies()` (where writes are allowed).
 */
export interface CookieJar {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: Record<string, unknown>): unknown;
  delete(name: string): unknown;
}

/** Readable side only (request cookies, read-only `cookies()`). */
export type CookieReader = Pick<CookieJar, "get">;

function baseOptions() {
  return {
    httpOnly: true,
    secure: authEnv().secureCookies,
    sameSite: "lax" as const,
    path: "/",
  };
}

/**
 * Seconds until the JWT expires, from its own `exp` claim, so a cookie never
 * outlives (or dies before) the token it holds — whatever lifetimes
 * timmbr-core is configured with. Undefined (session cookie) if unreadable.
 */
export function secondsUntilExpiry(
  token: string,
  now = Date.now(),
): number | undefined {
  const exp = parseJwt<{ exp?: number }>(token)?.exp;
  if (typeof exp !== "number") return undefined;
  return Math.max(0, Math.floor(exp - now / 1000));
}

export function setSessionCookies(jar: CookieJar, pair: TokenPair) {
  const options = baseOptions();
  jar.set(ACCESS_COOKIE, pair.accessToken, {
    ...options,
    maxAge: secondsUntilExpiry(pair.accessToken),
  });
  jar.set(REFRESH_COOKIE, pair.refreshToken, {
    ...options,
    maxAge: secondsUntilExpiry(pair.refreshToken),
  });
}

export function clearSessionCookies(jar: CookieJar) {
  const options = { ...baseOptions(), maxAge: 0 };
  jar.set(ACCESS_COOKIE, "", options);
  jar.set(REFRESH_COOKIE, "", options);
}

export function readSessionTokens(jar: CookieReader): Partial<TokenPair> {
  return {
    accessToken: jar.get(ACCESS_COOKIE)?.value || undefined,
    refreshToken: jar.get(REFRESH_COOKIE)?.value || undefined,
  };
}

export function setOAuthBindCookie(jar: CookieJar, nonce: string) {
  jar.set(OAUTH_BIND_COOKIE, nonce, {
    ...baseOptions(),
    maxAge: OAUTH_BIND_MAX_AGE_S,
  });
}

export function readOAuthBindCookie(jar: CookieReader): string | undefined {
  return jar.get(OAUTH_BIND_COOKIE)?.value || undefined;
}

/** Single use: cleared as soon as the callback runs, success or not. */
export function clearOAuthBindCookie(jar: CookieJar) {
  jar.set(OAUTH_BIND_COOKIE, "", { ...baseOptions(), maxAge: 0 });
}
