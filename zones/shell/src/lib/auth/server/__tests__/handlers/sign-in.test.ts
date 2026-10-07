// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { coreReply, jwt, mockCore, request, setCookies } from "../test-helpers";
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
const ME = {
  id: "u1",
  name: "Daenerys Targaryen",
  email: "dany@example.com",
  role: "USER",
};

afterEach(() => vi.unstubAllGlobals());

describe("sign-in handlers", () => {
  it("otpVerify sets httpOnly session cookies and returns no tokens", async () => {
    const fetchMock = mockCore({
      "/auth/otp/verify": () =>
        coreReply({ success: true, data: { ...SESSION, isNewUser: true } }),
    });

    const response = await authHandlers.otpVerify(
      request("/api/auth/otp/verify", {
        method: "POST",
        body: { identifier: "a@b.co", code: "123456" },
      }),
    );
    const body = await response.json();

    expect(body).toEqual({
      success: true,
      data: { user: ME, isNewUser: true },
    });
    expect(JSON.stringify(body)).not.toMatch(/rt-1|accessToken|refreshToken/);
    expect(setCookies(response)).toMatchObject({
      timmbr_access_token: SESSION.accessToken,
      timmbr_refresh_token: "rt-1",
    });
    expect(response.headers.getSetCookie().join("\n")).toMatch(/HttpOnly/i);

    // Trusted call with the shopper's IP
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers["x-internal-key"]).toBeDefined();
    expect(headers["x-timmbr-client-ip"]).toBe("203.0.113.7");
  });

  it("passes core's error envelope through (e.g. RATE_LIMITED)", async () => {
    mockCore({
      "/auth/otp/send": () =>
        coreReply(
          {
            success: false,
            code: "RATE_LIMITED",
            message: "slow down",
            details: { retryAfter: 30 },
          },
          429,
        ),
    });

    const response = await authHandlers.otpSend(
      request("/api/auth/otp/send", {
        method: "POST",
        body: { identifier: "a@b.co" },
      }),
    );

    expect(response.status).toBe(429);
    expect(await response.json()).toMatchObject({
      code: "RATE_LIMITED",
      details: { retryAfter: 30 },
    });
  });

  it("rejects cross-origin requests (CSRF)", async () => {
    const fetchMock = mockCore({});

    const response = await authHandlers.login(
      request("/api/auth/login", {
        method: "POST",
        body: { identifier: "a@b.co", password: "x" },
        origin: "https://evil.com",
      }),
    );

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
