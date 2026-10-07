// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NextResponse } from "next/server";
import { jwt } from "../test-helpers";
import {
  secondsUntilExpiry,
  setSessionCookies,
} from "@/lib/auth/server/session/cookies";

const maxAge = (response: NextResponse, name: string) =>
  response.headers
    .getSetCookie()
    .find((c) => c.startsWith(`${name}=`))
    ?.match(/Max-Age=(\d+)/i)?.[1];

describe("session cookie lifetimes", () => {
  it("follow each token's own expiry, whatever core is configured with", () => {
    const response = new NextResponse(null);

    // e.g. core changed to 5-minute access and 30-day refresh tokens
    setSessionCookies(response.cookies, {
      accessToken: jwt(5 * 60),
      refreshToken: jwt(30 * 24 * 60 * 60),
    });

    expect(
      Number(maxAge(response, "timmbr_access_token")),
    ).toBeGreaterThanOrEqual(299);
    expect(Number(maxAge(response, "timmbr_access_token"))).toBeLessThanOrEqual(
      300,
    );
    expect(
      Number(maxAge(response, "timmbr_refresh_token")),
    ).toBeGreaterThanOrEqual(30 * 86400 - 1);
  });

  it("falls back to a session cookie when the token has no readable exp", () => {
    expect(secondsUntilExpiry("not-a-jwt")).toBeUndefined();
  });

  it("never returns a negative lifetime", () => {
    expect(secondsUntilExpiry(jwt(-60))).toBe(0);
  });
});
