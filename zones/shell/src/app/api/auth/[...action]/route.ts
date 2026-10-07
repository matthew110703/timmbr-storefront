import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROUTES, type AuthRouteName } from "@timmbr/auth/contract";
import { authHandlers } from "@/lib/auth/server";

/**
 * Auth BFF: the browser talks to these routes; they talk to timmbr-core and
 * keep the session in httpOnly cookies. No token is ever returned.
 *
 * The route table comes from AUTH_ROUTES in @timmbr/auth/contract, the same
 * list the browser client builds its URLs from, so paths can't drift.
 * `authHandlers` must have a handler for every route (type-checked there).
 */
const ROUTES = new Map<
  string,
  { method: "GET" | "POST"; action: AuthRouteName }
>(
  (Object.keys(AUTH_ROUTES) as AuthRouteName[]).map((action) => [
    AUTH_ROUTES[action].path,
    { method: AUTH_ROUTES[action].method, action },
  ]),
);

type Context = { params: Promise<{ action: string[] }> };

async function dispatch(request: NextRequest, { params }: Context) {
  const route = ROUTES.get((await params).action.join("/"));
  if (!route)
    return NextResponse.json(
      { success: false, code: "NOT_FOUND" },
      { status: 404 },
    );
  if (route.method !== request.method) {
    return NextResponse.json(
      { success: false, code: "METHOD_NOT_ALLOWED" },
      { status: 405, headers: { Allow: route.method } },
    );
  }
  return authHandlers[route.action](request);
}

export const GET = dispatch;
export const POST = dispatch;

// Always per-request: these read and set cookies.
export const dynamic = "force-dynamic";
