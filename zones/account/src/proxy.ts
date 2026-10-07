import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Sessions are refreshed and /account is gated by the shell's proxy (every
// request enters through the shell). Pages still verify with timmbr-core.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-zone", "account");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
