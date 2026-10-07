import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@timmbr/utils";

const get = vi.hoisted(() => vi.fn());
const cookieValue = vi.hoisted(() => ({
  token: "access-token" as string | undefined,
}));
const headerValues = vi.hoisted(() => ({ map: new Map<string, string>() }));
const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
);

vi.mock("@/lib/api/client", async () => ({
  api: { get },
  isApiError: (await import("@timmbr/utils")).isApiError,
}));
vi.mock("@/env", () => ({
  env: { NEXT_PUBLIC_DOMAIN: "localhost:3000", NODE_ENV: "development" },
}));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "timmbr_access_token" && cookieValue.token
        ? { value: cookieValue.token }
        : undefined,
  }),
  headers: async () => ({
    get: (name: string) => headerValues.map.get(name) ?? null,
  }),
}));

import { requireUser } from "./session";

describe("requireUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookieValue.token = "access-token";
    headerValues.map = new Map([["x-forwarded-host", "localhost:3000"]]);
  });

  it("sends the session cookie's token explicitly to timmbr-core", async () => {
    get.mockResolvedValue({
      id: "u1",
      name: "Dany",
      email: "dany@example.com",
    });

    await expect(requireUser("/account")).resolves.toMatchObject({ id: "u1" });
    expect(get).toHaveBeenCalledWith("/user/me", {
      token: "access-token",
      cache: "no-store",
    });
  });

  it("redirects to the SHELL's sign-in with an absolute URL (no basePath loop)", async () => {
    get.mockRejectedValue(new ApiError(401, "Unauthorized"));

    await expect(requireUser("/account/orders")).rejects.toThrow(
      "NEXT_REDIRECT:http://localhost:3000/?signin=1&returnTo=%2Faccount%2Forders",
    );
  });

  it("redirects without calling core when there is no session cookie", async () => {
    cookieValue.token = undefined;

    await expect(requireUser("/account")).rejects.toThrow(
      "NEXT_REDIRECT:http://localhost:3000/",
    );
    expect(get).not.toHaveBeenCalled();
  });

  it("on a direct hit (no x-forwarded-host) still sends users to the storefront", async () => {
    headerValues.map = new Map([["host", "localhost:3003"]]);
    cookieValue.token = undefined;

    await expect(requireUser("/account")).rejects.toThrow(
      "NEXT_REDIRECT:http://localhost:3000/?signin=1",
    );
  });

  it("does not hide other failures behind a sign-in redirect", async () => {
    get.mockRejectedValue(new ApiError(503, "Service unavailable"));

    await expect(requireUser("/account")).rejects.toMatchObject({
      statusCode: 503,
    });
    expect(redirect).not.toHaveBeenCalled();
  });
});
