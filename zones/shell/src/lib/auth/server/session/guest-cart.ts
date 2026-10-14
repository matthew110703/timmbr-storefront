import type { NextResponse } from "next/server";
import { GUEST_CART_COOKIE } from "../constants";
import { coreFetch } from "../core";
import { authEnv } from "../env";
import type { CookieJar, CookieReader } from "./cookies";

/**
 * Guest carts live in timmbr-core (Redis), identified by an httpOnly cookie that core sets on
 * the first add. Browsers only talk to the storefront domain, so the BFF carries that ONE cookie
 * across: forwarded to core on /api/core calls, and core's Set-Cookie for it re-issued on the
 * storefront domain. No other cookie crosses in either direction (session cookies never reach
 * core; core's other cookies never reach the browser).
 */

/** `Cookie` header for core: the guest cart id only, or undefined. */
export function guestCartCookieHeader(jar: CookieReader): string | undefined {
  const value = jar.get(GUEST_CART_COOKIE)?.value;
  return value
    ? `${GUEST_CART_COOKIE}=${encodeURIComponent(value)}`
    : undefined;
}

interface ParsedCookie {
  value: string;
  maxAge?: number;
}

/** The guest cart cookie from a list of Set-Cookie headers, if core set (or cleared) it. */
export function parseGuestCartSetCookie(
  setCookies: string[],
): ParsedCookie | null {
  for (const header of setCookies) {
    const [pair, ...attributes] = header.split(";");
    const separator = pair.indexOf("=");
    if (separator < 0 || pair.slice(0, separator).trim() !== GUEST_CART_COOKIE)
      continue;
    const value = decodeURIComponent(pair.slice(separator + 1).trim());
    let maxAge: number | undefined;
    for (const attribute of attributes) {
      const [name, raw] = attribute.split("=").map((part) => part.trim());
      if (name.toLowerCase() === "max-age" && raw !== undefined) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) maxAge = parsed;
      } else if (
        name.toLowerCase() === "expires" &&
        raw &&
        maxAge === undefined
      ) {
        const ms = Date.parse(raw) - Date.now();
        if (Number.isFinite(ms)) maxAge = Math.max(0, Math.floor(ms / 1000));
      }
    }
    return { value, maxAge };
  }
  return null;
}

function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: authEnv().secureCookies,
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge !== undefined && { maxAge }),
  };
}

/** Re-issues core's guest cart cookie (set or cleared) on the storefront domain. */
export function relayGuestCartCookie(upstream: Response, jar: CookieJar) {
  const parsed = parseGuestCartSetCookie(
    upstream.headers.getSetCookie?.() ?? [],
  );
  if (!parsed) return;
  if (!parsed.value || parsed.maxAge === 0) {
    jar.set(GUEST_CART_COOKIE, "", cookieOptions(0));
  } else {
    jar.set(GUEST_CART_COOKIE, parsed.value, cookieOptions(parsed.maxAge));
  }
}

/**
 * After a sign-in: moves the guest cart into the account's cart, then drops the guest cookie.
 * Best effort: a failed merge never fails the sign-in (the guest cart simply stays a guest cart
 * until it expires).
 */
export async function mergeGuestCart(
  request: { cookies: CookieReader; headers: Headers },
  accessToken: string,
  response: NextResponse,
  clientIp?: string,
) {
  const cookie = guestCartCookieHeader(request.cookies);
  if (!cookie) return;
  try {
    await coreFetch("/cart/merge", {
      method: "POST",
      accessToken,
      cookie,
      clientIp,
    });
    response.cookies.set(GUEST_CART_COOKIE, "", cookieOptions(0));
  } catch {
    // Keep the cookie: the cart is still there for the next attempt.
  }
}
