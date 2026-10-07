// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { coreReply, jwt, mockCore, request } from "../test-helpers";
import { corePassthrough } from "@/lib/auth/server/handlers/core-passthrough";

const ACCESS_TOKEN = jwt(900);

afterEach(() => vi.unstubAllGlobals());

describe("corePassthrough", () => {
  it("forwards with the session's token", async () => {
    const fetchMock = mockCore({
      "/cart": () => coreReply({ success: true, data: { items: [] } }),
    });

    const response = await corePassthrough(
      request("/api/core/cart", {
        cookies: { timmbr_access_token: ACCESS_TOKEN },
      }),
      ["cart"],
    );

    expect(response.status).toBe(200);
    const headers = (fetchMock.mock.calls[0][1] as RequestInit)
      .headers as Headers;
    expect(headers.get("authorization")).toBe(`Bearer ${ACCESS_TOKEN}`);
  });

  it("refuses auth endpoints, which return tokens in trusted mode", async () => {
    const fetchMock = mockCore({});

    const response = await corePassthrough(
      request("/api/core/auth/refresh", {
        method: "POST",
        cookies: { timmbr_refresh_token: "rt" },
      }),
      ["auth", "refresh"],
    );

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops upstream Set-Cookie headers", async () => {
    mockCore({
      "/cart": () =>
        new Response("{}", {
          headers: { "content-type": "application/json", "set-cookie": "x=1" },
        }),
    });

    const response = await corePassthrough(request("/api/core/cart"), ["cart"]);

    expect(response.headers.getSetCookie()).toEqual([]);
  });
});
