import { vi } from "vitest";
import { NextRequest } from "next/server";

export const CORE = "http://core.test";
export const STOREFRONT = "http://shop.test";

process.env.CORE_API_URL = CORE;
process.env.CORE_INTERNAL_KEY = "test-internal-key-0123456789abcdef0123";
process.env.STOREFRONT_URL = STOREFRONT;

const b64 = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

/** Unsigned JWT with the given expiry offset (seconds from now). */
export function jwt(expiresInS: number, sub = "u1") {
  const exp = Math.floor(Date.now() / 1000) + expiresInS;
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, exp })}.sig`;
}

export function coreReply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Mock fetch that routes by core path ("/auth/refresh", …). */
export function mockCore(routes: Record<string, () => Response>) {
  const fetchMock = vi.fn(
    async (input: string | URL | Request, _init?: RequestInit) => {
      const url = new URL(String(input));
      const path = url.pathname.replace(/^\/api\/v1/, "");
      const route = routes[path];
      if (!route) throw new Error(`unexpected core call: ${path}`);
      return route();
    },
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function request(
  path: string,
  init: {
    method?: string;
    body?: unknown;
    cookies?: Record<string, string>;
    origin?: string | null;
  } = {},
) {
  const headers = new Headers({ "x-forwarded-for": "203.0.113.7" });
  if (init.origin !== null) headers.set("origin", init.origin ?? STOREFRONT);
  if (init.body !== undefined) headers.set("content-type", "application/json");
  if (init.cookies) {
    headers.set(
      "cookie",
      Object.entries(init.cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; "),
    );
  }
  return new NextRequest(`${STOREFRONT}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

/** Parsed Set-Cookie values of a response, by name. */
export function setCookies(response: Response): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of response.headers.getSetCookie()) {
    const [pair] = line.split(";");
    const [name, ...rest] = pair.split("=");
    result[name] = rest.join("=");
  }
  return result;
}
