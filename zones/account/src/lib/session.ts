import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "@timmbr/utils";
import { env } from "@/env";
import { api, isApiError } from "@/lib/api/client";

export interface AccountUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Absolute URL of the shell's sign-in. It must be absolute: this zone has
 * basePath "/account", and Next prefixes relative redirect targets with it
 * ("/?signin=1" would become "/account?signin=1" — this page again, a loop).
 * Behind the shell, x-forwarded-host is the storefront host; on a direct hit
 * we fall back to NEXT_PUBLIC_DOMAIN.
 */
async function signInUrl(returnTo: string) {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? env.NEXT_PUBLIC_DOMAIN;
  const proto =
    h.get("x-forwarded-proto") ??
    (env.NODE_ENV === "production" ? "https" : "http");
  const query = new URLSearchParams({ signin: "1", returnTo });
  return `${proto}://${host}/?${query}`;
}

/**
 * The signed-in user, verified by timmbr-core. The shell keeps the session
 * cookie fresh; this zone only reads it. Without a valid session (no cookie,
 * or an expired token on a direct hit) redirect to the shell's sign-in.
 */
export async function requireUser(returnTo: string): Promise<AccountUser> {
  // Read the cookie with Next's own API and pass it explicitly (don't rely on
  // the API client discovering it at runtime).
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) redirect(await signInUrl(returnTo));

  try {
    return await api.get<AccountUser>("/user/me", { token, cache: "no-store" });
  } catch (error) {
    if (
      isApiError(error) &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      redirect(await signInUrl(returnTo));
    }
    throw error;
  }
}
