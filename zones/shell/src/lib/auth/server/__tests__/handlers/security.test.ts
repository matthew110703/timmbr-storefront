// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { coreReply, mockCore, request, setCookies } from "../test-helpers";
import { authHandlers } from "@/lib/auth/server/handlers";

const b64 = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
/** Access token carrying the account email (as timmbr-core issues it). */
const accessToken = (email = "dany@example.com") =>
  `${b64({ alg: "HS256" })}.${b64({ sub: "u1", email, exp: Math.floor(Date.now() / 1000) + 900 })}.sig`;

const SESSION = {
  id: "u1",
  name: "Daenerys Targaryen",
  email: "dany@example.com",
  role: "USER",
  emailVerified: true,
  accessToken: accessToken(),
  refreshToken: "rt-new",
};
const cookies = () => ({
  timmbr_access_token: accessToken(),
  timmbr_refresh_token: "rt-old",
});
const body = (fetchMock: ReturnType<typeof mockCore>, call: number) =>
  JSON.parse(String((fetchMock.mock.calls[call][1] as RequestInit).body));

afterEach(() => vi.unstubAllGlobals());

describe("passwordChange", () => {
  it("changes the password, then signs this device back in with the new one", async () => {
    const fetchMock = mockCore({
      "/auth/change-password": () => coreReply({ success: true, data: null }),
      "/auth/login": () => coreReply({ success: true, data: SESSION }),
    });

    const response = await authHandlers.passwordChange(
      request("/api/auth/password/change", {
        method: "POST",
        body: { currentPassword: "Old#1234", newPassword: "New#1234" },
        cookies: cookies(),
      }),
    );

    expect(body(fetchMock, 0)).toEqual({
      oldPassword: "Old#1234",
      newPassword: "New#1234",
    });
    expect(body(fetchMock, 1)).toEqual({
      identifier: "dany@example.com",
      password: "New#1234",
    });
    expect(await response.json()).toMatchObject({
      success: true,
      data: { user: { id: "u1" } },
    });
    expect(setCookies(response)).toMatchObject({
      timmbr_refresh_token: "rt-new",
    });
  });

  it("passes core's error through (wrong current password) and keeps the session", async () => {
    mockCore({
      "/auth/change-password": () =>
        coreReply(
          {
            success: false,
            code: "INVALID_CREDENTIALS",
            message: "Current password is incorrect.",
          },
          401,
        ),
    });

    const response = await authHandlers.passwordChange(
      request("/api/auth/password/change", {
        method: "POST",
        body: { currentPassword: "nope", newPassword: "New#1234" },
        cookies: cookies(),
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      code: "INVALID_CREDENTIALS",
    });
    expect(setCookies(response).timmbr_refresh_token).toBeUndefined();
  });

  it("ends this session too if the fresh sign-in fails", async () => {
    mockCore({
      "/auth/change-password": () => coreReply({ success: true, data: null }),
      "/auth/login": () => coreReply({ success: false, code: "INTERNAL" }, 500),
    });

    const response = await authHandlers.passwordChange(
      request("/api/auth/password/change", {
        method: "POST",
        body: { currentPassword: "Old#1234", newPassword: "New#1234" },
        cookies: cookies(),
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

  it("requires a session and a same-origin request", async () => {
    const fetchMock = mockCore({});

    const anonymous = await authHandlers.passwordChange(
      request("/api/auth/password/change", { method: "POST", body: {} }),
    );
    const crossSite = await authHandlers.passwordChange(
      request("/api/auth/password/change", {
        method: "POST",
        body: {},
        cookies: cookies(),
        origin: "https://evil.com",
      }),
    );

    expect(anonymous.status).toBe(401);
    expect(crossSite.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("logoutAll", () => {
  it("revokes every session at core and clears this device's cookies", async () => {
    const fetchMock = mockCore({
      "/auth/logout-all": () => coreReply({ success: true, data: null }),
    });

    const response = await authHandlers.logoutAll(
      request("/api/auth/logout-all", { method: "POST", cookies: cookies() }),
    );

    const headers = (fetchMock.mock.calls[0][1] as RequestInit)
      .headers as Record<string, string>;
    expect(headers.Authorization).toMatch(/^Bearer /);
    expect(await response.json()).toEqual({ success: true, data: null });
    expect(setCookies(response)).toMatchObject({
      timmbr_access_token: "",
      timmbr_refresh_token: "",
    });
  });

  it("rejects cross-origin requests (CSRF)", async () => {
    const fetchMock = mockCore({});
    const response = await authHandlers.logoutAll(
      request("/api/auth/logout-all", {
        method: "POST",
        cookies: cookies(),
        origin: "https://evil.com",
      }),
    );
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
