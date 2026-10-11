import { NextResponse } from "next/server";
import { parseJwt } from "@timmbr/utils";
import type { CoreSession } from "../types";
import { clientIpFrom, coreFetch } from "../core";
import {
  csrfRejected,
  fail,
  fromError,
  isSameOrigin,
  ok,
  readJson,
  withCookies,
  type Handler,
} from "../http";
import { clearSessionCookies } from "../session/cookies";
import { freshSessionTokens } from "../session/refresh";
import { signedIn } from "./shared";

/**
 * Account security actions that change the session itself, so they go
 * through the BFF (the /api/core pass-through blocks `auth/*`).
 */

const signInAgain = () => fail(401, "UNAUTHORIZED", "Please sign in again.");

/**
 * Change a known password. timmbr-core revokes every session on success, so
 * the BFF immediately signs in again with the new password: this device stays
 * signed in, every other device is signed out.
 */
export const passwordChange: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();
  const { currentPassword, newPassword } = await readJson<{
    currentPassword?: string;
    newPassword?: string;
  }>(request);

  const cookieUpdates = new NextResponse(null);
  const { accessToken } = await freshSessionTokens(request, cookieUpdates);
  if (!accessToken) return withCookies(signInAgain(), cookieUpdates);
  const clientIp = clientIpFrom(request.headers);

  try {
    await coreFetch("/auth/change-password", {
      method: "POST",
      body: { oldPassword: currentPassword, newPassword },
      accessToken,
      clientIp,
    });
  } catch (error) {
    return withCookies(fromError(error), cookieUpdates);
  }

  // The access token (ours, from the httpOnly cookie) names the account.
  const email = parseJwt<{ email?: string }>(accessToken)?.email;
  try {
    if (!email) throw new Error("no email in access token");
    const session = await coreFetch<CoreSession>("/auth/login", {
      method: "POST",
      body: { identifier: email, password: newPassword },
      clientIp,
    });
    return signedIn(session);
  } catch {
    // Password changed, but the fresh sign-in failed: end this session too
    // rather than leave cookies whose refresh token core already revoked.
    const response = ok({ user: null });
    clearSessionCookies(response.cookies);
    return response;
  }
};

/** Sign out on every device: core revokes all sessions, then clear ours. */
export const logoutAll: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();

  const cookieUpdates = new NextResponse(null);
  const { accessToken } = await freshSessionTokens(request, cookieUpdates);

  if (accessToken) {
    try {
      await coreFetch("/auth/logout-all", {
        method: "POST",
        accessToken,
        clientIp: clientIpFrom(request.headers),
      });
    } catch (error) {
      return withCookies(fromError(error), cookieUpdates);
    }
  }

  const response = ok(null);
  clearSessionCookies(response.cookies);
  return response;
};
