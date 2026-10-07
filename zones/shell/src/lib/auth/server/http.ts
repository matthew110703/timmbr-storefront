import { NextResponse, type NextRequest } from "next/server";
import { isApiError } from "@timmbr/utils";
import { authEnv } from "./env";

/**
 * HTTP plumbing shared by the BFF route handlers: the JSON envelope the
 * browser receives (`{ success, data }`, same as timmbr-core), error
 * pass-through, the CSRF origin check and body parsing.
 */

export type Handler = (request: NextRequest) => Promise<NextResponse>;

// ─── Responses ───────────────────────────────────────────────────────────────

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(status: number, code: string, message: string) {
  return NextResponse.json(
    { success: false, statusCode: status, code, message },
    { status },
  );
}

/** Pass timmbr-core's error envelope through (codes like OTP_INVALID, RATE_LIMITED). */
export function fromError(error: unknown) {
  if (isApiError(error)) {
    if (error.isNetworkError) {
      return fail(
        503,
        "CORE_UNAVAILABLE",
        "Service temporarily unavailable. Please try again.",
      );
    }
    if (error.details && typeof error.details === "object") {
      return NextResponse.json(error.details, { status: error.statusCode });
    }
    return fail(error.statusCode, error.code ?? "ERROR", error.message);
  }
  console.error("[auth] unexpected error", error);
  return fail(
    500,
    "INTERNAL_SERVER_ERROR",
    "Something went wrong. Please try again.",
  );
}

/** Move cookie updates (collected on a scratch response) onto the one returned. */
export function withCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}

// ─── Requests ────────────────────────────────────────────────────────────────

/**
 * CSRF guard for state-changing requests: only our own pages may call these.
 * Cookies are SameSite=Lax as well; this also covers same-site subdomains.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") === "same-origin";
  const allowed = [request.nextUrl.origin, authEnv().storefrontUrl].filter(
    Boolean,
  );
  return allowed.includes(origin);
}

export function csrfRejected() {
  return fail(403, "CSRF_REJECTED", "Request origin not allowed.");
}

/** The JSON body, or `{}` when it's missing or malformed (core validates the fields). */
export async function readJson<T>(request: NextRequest): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}
