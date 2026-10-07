// @vitest-environment node
import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  coreReply,
  jwt,
  mockCore,
  request,
  setCookies,
  STOREFRONT,
} from "../test-helpers";
import { authHandlers } from "@/lib/auth/server/handlers";

const SESSION = {
  id: "u1",
  name: "Daenerys Targaryen",
  email: "dany@example.com",
  role: "USER",
  emailVerified: true,
  accessToken: jwt(900),
  refreshToken: "rt-1",
};

afterEach(() => vi.unstubAllGlobals());

describe("Google OAuth", () => {
  it("start: binds the flow to this browser and sends only the nonce's hash", async () => {
    const response = await authHandlers.oauthStart(
      request("/api/auth/oauth/start?provider=google"),
    );

    const nonce = setCookies(response).timmbr_oauth_bind;
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/api/v1/auth/google");
    expect(location.searchParams.get("bind")).toBe(
      createHash("sha256").update(nonce).digest("hex"),
    );
    expect(location.search).not.toContain(nonce);
  });

  it("callback: exchanges the code with the nonce and sets the session", async () => {
    const fetchMock = mockCore({
      "/auth/oauth/exchange": () => coreReply({ success: true, data: SESSION }),
    });

    const response = await authHandlers.oauthCallback(
      request("/api/auth/oauth/callback?code=abc", {
        cookies: { timmbr_oauth_bind: "nonce" },
        origin: null,
      }),
    );

    expect(response.headers.get("location")).toBe(
      `${STOREFRONT}/oauth/callback?status=success`,
    );
    expect(
      JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)),
    ).toEqual({
      code: "abc",
      bind: "nonce",
    });
    expect(setCookies(response)).toMatchObject({
      timmbr_refresh_token: "rt-1",
      timmbr_oauth_bind: "",
    });
  });

  it("callback: fails without the binding cookie (login CSRF)", async () => {
    const fetchMock = mockCore({});

    const response = await authHandlers.oauthCallback(
      request("/api/auth/oauth/callback?code=abc", { origin: null }),
    );

    expect(response.headers.get("location")).toBe(
      `${STOREFRONT}/oauth/callback?status=error`,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
