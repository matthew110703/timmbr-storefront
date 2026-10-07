import type { NextRequest, NextResponse } from "next/server";
// Imported directly (not via the index) so the per-request proxy bundle stays
// small: the index also pulls in every route handler and the CMS client.
import { createSessionProxy } from "@/lib/auth/server/session/proxy";

/** Zone paths that need a signed-in user. The shell owns this policy. */
const PROTECTED_PREFIXES = ["/account"];

function isProtected(path: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function securityHeaders(response: NextResponse, request: NextRequest) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Multi-Zone Ingress Trace ID
  const correlationId =
    request.headers.get("x-correlation-id") || crypto.randomUUID();
  response.headers.set("x-correlation-id", correlationId);
}

/**
 * Every request enters the storefront here — including /products, /checkout
 * and /account, which next.config then rewrites to their zones. So this is the
 * one place sessions are refreshed and protected paths are gated.
 */
export const proxy = createSessionProxy({
  protect: isProtected,
  decorate: securityHeaders,
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (route handlers refresh on their own)
     * - zone assets (*-static) and _next/static, _next/image
     * - metadata files
     */
    "/((?!api|products-static|checkout-static|account-static|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
