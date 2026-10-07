// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  coreReply,
  jwt,
  mockCore,
  request,
  setCookies,
  STOREFRONT,
} from "../test-helpers";
import { createSessionProxy } from "@/lib/auth/server/session/proxy";

afterEach(() => vi.unstubAllGlobals());

const protectAll = createSessionProxy({ protect: () => true });
const open = createSessionProxy();

describe("createSessionProxy", () => {
  it("does nothing (no core call) while the access token is fresh", async () => {
    const fetchMock = mockCore({});

    const response = await open(
      request("/", { cookies: { timmbr_access_token: jwt(900) } }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it("refreshes an expiring token for the response and the forwarded request", async () => {
    const pair = { accessToken: jwt(900), refreshToken: "rt-2" };
    mockCore({
      "/auth/refresh": () => coreReply({ success: true, data: pair }),
    });

    const response = await open(
      request("/", {
        cookies: { timmbr_access_token: jwt(30), timmbr_refresh_token: "rt-1" },
      }),
    );

    expect(setCookies(response)).toMatchObject({
      timmbr_refresh_token: "rt-2",
    });
    // Forwarded request cookies (what this render sees)
    expect(response.headers.get("x-middleware-request-cookie")).toContain(
      "rt-2",
    );
  });

  it("redirects protected paths to sign-in on the storefront, keeping returnTo", async () => {
    mockCore({});

    const response = await protectAll(request("/account/orders?page=2"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${STOREFRONT}/?signin=1&returnTo=%2Faccount%2Forders%3Fpage%3D2`,
    );
  });

  it("clears cookies and redirects when the refresh token is rejected", async () => {
    mockCore({
      "/auth/refresh": () => coreReply({ code: "TOKEN_REVOKED" }, 401),
    });

    const response = await protectAll(
      request("/account", { cookies: { timmbr_refresh_token: "revoked" } }),
    );

    expect(response.status).toBe(307);
    expect(setCookies(response)).toMatchObject({
      timmbr_access_token: "",
      timmbr_refresh_token: "",
    });
  });

  it("lets protected pages through when core is briefly unreachable (getSession decides)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );

    const response = await protectAll(
      request("/account", { cookies: { timmbr_refresh_token: "rt-1" } }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()).toEqual([]);
  });

  it("applies zone headers", async () => {
    mockCore({});
    const proxy = createSessionProxy({
      decorate: (res) => res.headers.set("x-zone", "account"),
    });

    const response = await proxy(request("/"));

    expect(response.headers.get("x-zone")).toBe("account");
  });
});
