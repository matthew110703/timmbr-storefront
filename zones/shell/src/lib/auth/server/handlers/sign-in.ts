import { NextResponse } from "next/server";
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
import { freshSessionTokens } from "../session/refresh";
import { signedIn } from "./shared";

/**
 * Sign-in steps: OTP send/verify, password login, and setting a password with
 * the token from OTP verification. Successful steps set the session cookies
 * and return only the user.
 */

export const otpSend: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();
  const { identifier } = await readJson<{ identifier?: string }>(request);
  try {
    const result = await coreFetch("/auth/otp/send", {
      method: "POST",
      body: { identifier },
      clientIp: clientIpFrom(request.headers),
    });
    return ok(result);
  } catch (error) {
    return fromError(error);
  }
};

export const otpVerify: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();
  const { identifier, code, intent } = await readJson<{
    identifier?: string;
    code?: string;
    intent?: string;
  }>(request);
  try {
    const session = await coreFetch<CoreSession>("/auth/otp/verify", {
      method: "POST",
      body: { identifier, code, ...(intent && { intent }) },
      clientIp: clientIpFrom(request.headers),
    });
    return signedIn(session);
  } catch (error) {
    return fromError(error);
  }
};

export const login: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();
  const { identifier, password } = await readJson<{
    identifier?: string;
    password?: string;
  }>(request);
  try {
    const session = await coreFetch<CoreSession>("/auth/login", {
      method: "POST",
      body: { identifier, password },
      clientIp: clientIpFrom(request.headers),
    });
    return signedIn(session);
  } catch (error) {
    return fromError(error);
  }
};

export const passwordSet: Handler = async (request) => {
  if (!isSameOrigin(request)) return csrfRejected();
  const { token, password } = await readJson<{
    token?: string;
    password?: string;
  }>(request);

  const cookieUpdates = new NextResponse(null);
  const { accessToken } = await freshSessionTokens(request, cookieUpdates);
  if (!accessToken)
    return withCookies(
      fail(401, "UNAUTHORIZED", "Please sign in again."),
      cookieUpdates,
    );

  try {
    const session = await coreFetch<CoreSession>("/auth/password/set", {
      method: "POST",
      body: { token, password },
      accessToken,
      clientIp: clientIpFrom(request.headers),
    });
    return signedIn(session);
  } catch (error) {
    return withCookies(fromError(error), cookieUpdates);
  }
};
