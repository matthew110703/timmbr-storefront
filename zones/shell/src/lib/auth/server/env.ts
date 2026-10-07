/**
 * Server-only configuration, read lazily (on first use, not at import time).
 *
 * - CORE_API_URL: timmbr-core base URL reachable from the shell's server
 *   (defaults to NEXT_PUBLIC_API_URL).
 * - CORE_INTERNAL_KEY: shared secret identifying the BFF to timmbr-core.
 * - STOREFRONT_URL: public origin of the storefront (where every zone is
 *   served), used for absolute sign-in redirects and the CSRF origin check.
 */
export interface AuthServerEnv {
  coreApiUrl: string;
  internalKey: string;
  storefrontUrl: string | undefined;
  secureCookies: boolean;
}

export function authEnv(): AuthServerEnv {
  const coreApiUrl =
    process.env.CORE_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  const internalKey = process.env.CORE_INTERNAL_KEY;

  if (!coreApiUrl)
    throw new Error("[auth] CORE_API_URL (or NEXT_PUBLIC_API_URL) is not set.");
  if (!internalKey) throw new Error("[auth] CORE_INTERNAL_KEY is not set.");

  return {
    coreApiUrl: coreApiUrl.replace(/\/+$/, ""),
    internalKey,
    storefrontUrl: process.env.STOREFRONT_URL?.replace(/\/+$/, ""),
    secureCookies: process.env.NODE_ENV === "production",
  };
}
