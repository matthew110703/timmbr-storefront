import type { RequestOptions } from "@timmbr/utils";
import { api } from "@/lib/api/client";
import { getAccessToken, redirectIfUnauthorized } from "@/lib/session";

type Options = Omit<RequestOptions, "body" | "token"> & {
  /** Where to come back to after signing in, if the session has expired. */
  returnTo?: string;
};

/**
 * Server-side reads for the signed-in shopper: the session token is passed explicitly,
 * responses are never cached, and an expired session sends them to sign-in and back.
 */
export async function serverGet<T>(
  path: string,
  { returnTo = "/checkout", ...options }: Options = {},
) {
  try {
    return await api.get<T>(path, {
      ...options,
      token: await getAccessToken(),
      cache: "no-store",
    });
  } catch (error) {
    return redirectIfUnauthorized(error, returnTo);
  }
}

export async function serverPost<T>(
  path: string,
  body: unknown,
  { returnTo = "/checkout", ...options }: Options = {},
) {
  try {
    return await api.post<T>(path, body, {
      ...options,
      token: await getAccessToken(),
      cache: "no-store",
    });
  } catch (error) {
    return redirectIfUnauthorized(error, returnTo);
  }
}
