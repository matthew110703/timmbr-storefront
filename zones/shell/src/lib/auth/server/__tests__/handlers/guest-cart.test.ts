// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { coreReply, jwt, mockCore, request } from "../test-helpers";
import { authHandlers } from "@/lib/auth/server/handlers";
import { corePassthrough } from "@/lib/auth/server/handlers/core-passthrough";
import { parseGuestCartSetCookie } from "@/lib/auth/server/session/guest-cart";

const ACCESS_TOKEN = jwt(900);
const SESSION = {
  id: "u1",
  name: "Daenerys Targaryen",
  email: "dany@example.com",
  role: "USER",
  emailVerified: true,
  accessToken: ACCESS_TOKEN,
  refreshToken: "rt-1",
};

afterEach(() => vi.unstubAllGlobals());

const headersOf = (fetchMock: ReturnType<typeof mockCore>, call = 0) =>
  (fetchMock.mock.calls[call][1] as RequestInit).headers as Headers &
    Record<string, string>;

/** Set-Cookie lines of a response for one cookie name. */
const cookieLine = (response: Response, name: string) =>
  response.headers.getSetCookie().find((line) => line.startsWith(`${name}=`));

describe("guest cart cookie through /api/core", () => {
  it("forwards only the guest cart cookie to core, never the session cookies", async () => {
    const fetchMock = mockCore({
      "/cart/count": () => coreReply({ success: true, data: { count: 2 } }),
    });

    await corePassthrough(
      request("/api/core/cart/count", {
        cookies: {
          timmbr_access_token: ACCESS_TOKEN,
          timmbr_refresh_token: "rt",
          timmbr_guest_cart: "g-123",
          _ga: "tracking",
        },
      }),
      ["cart", "count"],
    );

    expect(headersOf(fetchMock).get("cookie")).toBe("timmbr_guest_cart=g-123");
  });

  it("re-issues core's guest cart cookie on the storefront domain", async () => {
    mockCore({
      "/cart/items": () =>
        new Response('{"success":true,"data":{}}', {
          headers: {
            "content-type": "application/json",
            "set-cookie":
              "timmbr_guest_cart=g-new; Max-Age=604800; Path=/; Domain=api.example; HttpOnly; SameSite=Lax",
          },
        }),
    });

    const response = await corePassthrough(
      request("/api/core/cart/items", { method: "POST", body: {} }),
      ["cart", "items"],
    );

    const line = cookieLine(response, "timmbr_guest_cart")!;
    expect(line).toMatch(/^timmbr_guest_cart=g-new;/);
    expect(line).toMatch(/Max-Age=604800/i);
    expect(line).toMatch(/HttpOnly/i);
    expect(line).not.toMatch(/Domain=/i);
  });

  it("clears the cookie when core clears it", async () => {
    mockCore({
      "/cart": () =>
        new Response("{}", {
          headers: {
            "set-cookie": "timmbr_guest_cart=; Max-Age=0; Path=/",
          },
        }),
    });

    const response = await corePassthrough(
      request("/api/core/cart", { method: "DELETE" }),
      ["cart"],
    );

    expect(cookieLine(response, "timmbr_guest_cart")).toMatch(/Max-Age=0/i);
  });

  it("parses Max-Age and Expires", () => {
    expect(
      parseGuestCartSetCookie(["other=1", "timmbr_guest_cart=abc; Max-Age=60"]),
    ).toEqual({ value: "abc", maxAge: 60 });
    expect(parseGuestCartSetCookie(["other=1"])).toBeNull();
  });
});

describe("guest cart merge at sign-in", () => {
  it("merges the guest cart into the account and clears the cookie", async () => {
    const fetchMock = mockCore({
      "/auth/login": () => coreReply({ success: true, data: SESSION }),
      "/cart/merge": () => coreReply({ success: true, data: { items: [] } }),
    });

    const response = await authHandlers.login(
      request("/api/auth/login", {
        method: "POST",
        body: { identifier: "a@b.co", password: "pw" },
        cookies: { timmbr_guest_cart: "g-123" },
      }),
    );

    expect(response.status).toBe(200);
    const merge = headersOf(fetchMock, 1);
    expect(String(fetchMock.mock.calls[1][0])).toContain("/cart/merge");
    expect(merge.Cookie).toBe("timmbr_guest_cart=g-123");
    expect(merge.Authorization).toBe(`Bearer ${ACCESS_TOKEN}`);
    expect(cookieLine(response, "timmbr_guest_cart")).toMatch(/Max-Age=0/i);
  });

  it("never fails the sign-in when the merge fails, and keeps the cookie", async () => {
    mockCore({
      "/auth/login": () => coreReply({ success: true, data: SESSION }),
      "/cart/merge": () => coreReply({ success: false, message: "down" }, 503),
    });

    const response = await authHandlers.login(
      request("/api/auth/login", {
        method: "POST",
        body: { identifier: "a@b.co", password: "pw" },
        cookies: { timmbr_guest_cart: "g-123" },
      }),
    );

    expect(response.status).toBe(200);
    expect(cookieLine(response, "timmbr_guest_cart")).toBeUndefined();
  });

  it("skips the merge without a guest cart", async () => {
    const fetchMock = mockCore({
      "/auth/login": () => coreReply({ success: true, data: SESSION }),
    });

    await authHandlers.login(
      request("/api/auth/login", {
        method: "POST",
        body: { identifier: "a@b.co", password: "pw" },
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
