// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { coreReply, jwt, mockCore, request, setCookies } from "../test-helpers";
import { authHandlers } from "@/lib/auth/server/handlers";

const ME = {
  id: "u1",
  name: "Daenerys Targaryen",
  email: "dany@example.com",
  role: "USER",
};

afterEach(() => vi.unstubAllGlobals());

describe("session handler", () => {
  it("returns user: null for anonymous visitors without calling core", async () => {
    const fetchMock = mockCore({});

    const response = await authHandlers.session(request("/api/auth/session"));

    expect(await response.json()).toEqual({
      success: true,
      data: { user: null },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refreshes an expired access token, then returns the user", async () => {
    const fresh = { accessToken: jwt(900), refreshToken: "rt-2" };
    mockCore({
      "/auth/refresh": () => coreReply({ success: true, data: fresh }),
      "/user/me": () => coreReply({ success: true, data: ME }),
    });

    const response = await authHandlers.session(
      request("/api/auth/session", {
        cookies: {
          timmbr_access_token: jwt(-10),
          timmbr_refresh_token: "rt-1",
        },
      }),
    );

    expect(await response.json()).toEqual({
      success: true,
      data: { user: ME },
    });
    expect(setCookies(response)).toMatchObject({
      timmbr_refresh_token: "rt-2",
    });
  });

  it("clears cookies when the refresh token is rejected", async () => {
    mockCore({
      "/auth/refresh": () => coreReply({ code: "TOKEN_REVOKED" }, 401),
    });

    const response = await authHandlers.session(
      request("/api/auth/session", {
        cookies: { timmbr_refresh_token: "stolen" },
      }),
    );

    expect(await response.json()).toEqual({
      success: true,
      data: { user: null },
    });
    expect(setCookies(response)).toMatchObject({
      timmbr_access_token: "",
      timmbr_refresh_token: "",
    });
  });
});

describe("logout", () => {
  it("revokes the refresh token and clears cookies", async () => {
    const fetchMock = mockCore({
      "/auth/logout": () => coreReply({ success: true, data: null }),
    });

    const response = await authHandlers.logout(
      request("/api/auth/logout", {
        method: "POST",
        cookies: {
          timmbr_access_token: jwt(900),
          timmbr_refresh_token: "rt-1",
        },
      }),
    );

    expect(
      JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body)),
    ).toEqual({
      refreshToken: "rt-1",
    });
    expect(setCookies(response)).toMatchObject({
      timmbr_access_token: "",
      timmbr_refresh_token: "",
    });
  });
});
