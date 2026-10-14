import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "@timmbr/utils";
import { env } from "@/env";
import { isApiError } from "@/lib/api/client";

/**
 * Absolute URL of the shell's sign-in. It must be absolute: this zone has basePath "/checkout",
 * and Next prefixes relative redirect targets with it. Behind the shell, x-forwarded-host is the
 * storefront host; on a direct hit we fall back to NEXT_PUBLIC_DOMAIN.
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

/** Redirect to sign-in when core rejects the session (401); rethrow anything else. */
export async function redirectIfUnauthorized(
  error: unknown,
  returnTo: string,
): Promise<never> {
  if (isApiError(error) && error.statusCode === 401) {
    redirect(await signInUrl(returnTo));
  }
  throw error;
}
