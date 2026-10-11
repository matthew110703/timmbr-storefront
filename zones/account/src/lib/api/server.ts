import type { PaginatedResult, RequestOptions } from "@timmbr/utils";
import { api } from "@/lib/api/client";
import { getAccessToken, redirectIfUnauthorized } from "@/lib/session";

type GetOptions = Omit<RequestOptions, "body" | "token"> & {
  /** Where to come back to after signing in, if the session has expired. */
  returnTo?: string;
};

/**
 * Server-side reads for the signed-in user: the session token is passed
 * explicitly, responses are never cached, and an expired session sends the
 * user to sign-in (then back to `returnTo`).
 */
export async function serverGet<T>(
  path: string,
  { returnTo = "/account", ...options }: GetOptions = {},
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

/** Like `serverGet`, keeping the pagination `meta`. */
export async function serverGetPaginated<T>(
  path: string,
  { returnTo = "/account", ...options }: GetOptions = {},
): Promise<PaginatedResult<T>> {
  try {
    return await api.getPaginated<T>(path, {
      ...options,
      token: await getAccessToken(),
      cache: "no-store",
    });
  } catch (error) {
    return redirectIfUnauthorized(error, returnTo);
  }
}
