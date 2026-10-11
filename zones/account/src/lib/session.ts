import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "@timmbr/utils";
import { env } from "@/env";
import { api, isApiError } from "@/lib/api/client";
import type { UserProfile } from "@/lib/api/types";

/**
 * Absolute URL of the shell's sign-in. It must be absolute: this zone has
 * basePath "/account", and Next prefixes relative redirect targets with it
 * ("/?signin=1" would become "/account?signin=1" — this page again, a loop).
 * Behind the shell, x-forwarded-host is the storefront host; on a direct hit
 * we fall back to NEXT_PUBLIC_DOMAIN.
 */
export async function signInUrl(returnTo: string) {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? env.NEXT_PUBLIC_DOMAIN;
  const proto =
    h.get("x-forwarded-proto") ??
    (env.NODE_ENV === "production" ? "https" : "http");
  const query = new URLSearchParams({ signin: "1", returnTo });
  return `${proto}://${host}/?${query}`;
}

/** The session's access token (httpOnly cookie, kept fresh by the shell). */
export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

/**
 * Redirect to sign-in when core rejects the session (401); rethrow anything
 * else. `statuses` widens this for the profile check, where 403 means a
 * deactivated account rather than "not yours".
 */
export async function redirectIfUnauthorized(
  error: unknown,
  returnTo: string,
  statuses: number[] = [401],
): Promise<never> {
  if (isApiError(error) && statuses.includes(error.statusCode)) {
    redirect(await signInUrl(returnTo));
  }
  throw error;
}

/**
 * The signed-in user, verified by timmbr-core. The shell keeps the session
 * cookie fresh; this zone only reads it. Without a valid session (no cookie,
 * or an expired token on a direct hit) redirect to the shell's sign-in.
 *
 * Cached per request: the layout and the page share one `/user/me` call.
 */
export const requireUser = cache(
  async (returnTo: string = "/account"): Promise<UserProfile> => {
    // Read the cookie with Next's own API and pass it explicitly (don't rely on
    // the API client discovering it at runtime).
    const token = await getAccessToken();
    if (!token) redirect(await signInUrl(returnTo));

    try {
      return await api.get<UserProfile>("/user/me", {
        token,
        cache: "no-store",
      });
    } catch (error) {
      return redirectIfUnauthorized(error, returnTo, [401, 403]);
    }
  },
);
