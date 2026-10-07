import { NextResponse } from "next/server";
import { isApiError } from "@timmbr/utils";
import type { SessionUser } from "../types";
import { clientIpFrom, coreFetch } from "../core";
import {
  csrfRejected,
  fromError,
  isSameOrigin,
  ok,
  withCookies,
  type Handler,
} from "../http";
import { clearSessionCookies, readSessionTokens } from "../session/cookies";
import { freshSessionTokens } from "../session/refresh";
import { toUser } from "./shared";

/** Who is signed in. Always 200: `{ user: null }` for anonymous visitors. */
export const session: Handler = async (request) => {
  const cookieUpdates = new NextResponse(null);
  const { accessToken } = await freshSessionTokens(request, cookieUpdates);
  if (!accessToken) return withCookies(ok({ user: null }), cookieUpdates);

  try {
    const user = await coreFetch<SessionUser>("/user/me", {
      accessToken,
      clientIp: clientIpFrom(request.headers),
    });
    return withCookies(ok({ user: toUser(user) }), cookieUpdates);
  } catch (error) {
    if (
      isApiError(error) &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      const response = ok({ user: null });
      clearSessionCookies(response.cookies);
      return response;
    }
    return withCookies(fromError(error), cookieUpdates);
  }
};

/** Revoke the refresh token at core (best effort) and clear the session cookies. */
export const logout: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();
  const { refreshToken } = readSessionTokens(request.cookies);
  if (refreshToken) {
    // Best effort: the cookies are cleared either way.
    await coreFetch("/auth/logout", {
      method: "POST",
      body: { refreshToken },
      clientIp: clientIpFrom(request.headers),
    }).catch(() => undefined);
  }
  const response = ok(null);
  clearSessionCookies(response.cookies);
  return response;
};
