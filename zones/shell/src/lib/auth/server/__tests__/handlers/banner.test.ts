import { afterEach, describe, expect, it, vi } from "vitest";

const getPageBySlug = vi.hoisted(() => vi.fn());
vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api")>()),
  getPageBySlug,
}));

import {
  bannerHandler,
  FALLBACK_AUTH_BANNER,
} from "@/lib/auth/server/handlers/banner";

afterEach(() => vi.resetAllMocks());

describe("GET /api/auth/banner", () => {
  it("returns the CMS banner in the { success, data: { banner } } envelope", async () => {
    getPageBySlug.mockResolvedValue({
      sections: [
        {
          type: "auth-banner",
          title: "WINTER",
          imageUrl: "https://cdn.example/w.png",
        },
      ],
    });

    const res = await bannerHandler();
    const body = await res.json();

    expect(getPageBySlug).toHaveBeenCalledWith("auth");
    expect(body.success).toBe(true);
    expect(body.data.banner).toMatchObject({
      title: "WINTER",
      imageUrl: "https://cdn.example/w.png",
      // Missing CMS fields fall back
      subtitle: FALLBACK_AUTH_BANNER.subtitle,
    });
    expect(res.headers.get("Cache-Control")).toContain("max-age=60");
  });

  it("falls back when the CMS has no banner (or is unreachable)", async () => {
    getPageBySlug.mockResolvedValue(null);
    const body = await (await bannerHandler()).json();
    expect(body.data.banner).toEqual(FALLBACK_AUTH_BANNER);
  });
});
