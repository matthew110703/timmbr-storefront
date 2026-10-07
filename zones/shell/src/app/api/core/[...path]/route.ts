import type { NextRequest } from "next/server";
import { corePassthrough } from "@/lib/auth/server";

/**
 * Client Components reach timmbr-core through here: the session's access
 * token is added server-side from the httpOnly cookie. (Server Components in
 * any zone call core directly; @timmbr/utils reads the cookie on the server.)
 */
type Context = { params: Promise<{ path: string[] }> };

async function handler(request: NextRequest, { params }: Context) {
  return corePassthrough(request, (await params).path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

export const dynamic = "force-dynamic";
