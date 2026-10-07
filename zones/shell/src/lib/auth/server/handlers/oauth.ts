import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import type { CoreSession } from "../types";
import { clientIpFrom, coreFetch } from "../core";
import { authEnv } from "../env";
import { fail, type Handler } from "../http";
import {
  clearOAuthBindCookie,
  readOAuthBindCookie,
  setOAuthBindCookie,
  setSessionCookies,
} from "../session/cookies";

/**
 * Starts Google sign-in (opened in the popup). Sets a binding nonce in an
 * httpOnly cookie and sends only its hash through the provider round-trip.
 */
export const oauthStart: Handler = async (request) => {
  const provider = request.nextUrl.searchParams.get("provider") ?? "google";
  if (provider !== "google")
    return fail(400, "UNSUPPORTED_PROVIDER", "Unsupported provider.");

  const nonce = randomBytes(32).toString("base64url");
  const bind = createHash("sha256").update(nonce).digest("hex");
  const publicApiUrl = (
    process.env.NEXT_PUBLIC_API_URL ?? authEnv().coreApiUrl
  ).replace(/\/+$/, "");

  const response = NextResponse.redirect(
    `${publicApiUrl}/api/v1/auth/${provider}?bind=${bind}`,
  );
  setOAuthBindCookie(response.cookies, nonce);
  return response;
};

/**
 * timmbr-core redirects here with a single-use code. Exchange it (with this
 * browser's binding nonce), set the session cookies, then show the popup's
 * result page.
 */
export const oauthCallback: Handler = async (request) => {
  const code = request.nextUrl.searchParams.get("code");
  const resultUrl = (status: "success" | "error") =>
    new URL(`/oauth/callback?status=${status}`, request.nextUrl.origin);

  const bind = readOAuthBindCookie(request.cookies);
  const errorResponse = NextResponse.redirect(resultUrl("error"));
  clearOAuthBindCookie(errorResponse.cookies);
  if (!code || !bind) return errorResponse;

  try {
    const session = await coreFetch<CoreSession>("/auth/oauth/exchange", {
      method: "POST",
      body: { code, bind },
      clientIp: clientIpFrom(request.headers),
    });
    const response = NextResponse.redirect(resultUrl("success"));
    clearOAuthBindCookie(response.cookies);
    setSessionCookies(response.cookies, session);
    return response;
  } catch {
    return errorResponse;
  }
};
