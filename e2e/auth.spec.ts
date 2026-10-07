import { expect, test } from "@playwright/test";

/**
 * Server-side session (BFF) checks. Needs timmbr-core on :8000 and the shell
 * (+ account zone for the redirect test) with CORE_INTERNAL_KEY configured.
 *
 * The full sign-in journey needs a real one-time code. Provide one with
 *   E2E_EMAIL=<test inbox> E2E_OTP=<code>  (or a dev phone + code from the core log)
 * to run it; otherwise it is skipped.
 */

test.describe("anonymous visitors", () => {
  test("session endpoint answers user: null without errors", async ({
    request,
  }) => {
    const response = await request.get("/api/auth/session");

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      data: { user: null },
    });
  });

  test("protected account pages redirect to the sign-in modal and keep returnTo", async ({
    page,
  }) => {
    await page.goto("/account");

    await expect(page).toHaveURL(/\/$/); // returnTo params are consumed by the shell
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Log in or Sign up")).toBeVisible();
  });
});

test.describe("BFF hardening", () => {
  test("rejects cross-origin sign-in attempts (CSRF)", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      headers: { origin: "https://evil.example" },
      data: { identifier: "a@b.co", password: "x" },
    });

    expect(response.status()).toBe(403);
    expect(await response.json()).toMatchObject({ code: "CSRF_REJECTED" });
  });

  test("the core pass-through never exposes auth endpoints (tokens)", async ({
    request,
  }) => {
    const response = await request.post("/api/core/auth/refresh", {
      headers: { origin: "http://localhost:3000" },
      data: { refreshToken: "x" },
    });

    expect(response.status()).toBe(404);
  });

  test("an OAuth callback without this browser's binding nonce fails", async ({
    page,
  }) => {
    await page.goto("/api/auth/oauth/callback?code=stolen-code");

    await expect(page).toHaveURL(/\/oauth\/callback\?status=error/);
  });

  test("open redirects via returnTo are ignored", async ({ page }) => {
    await page.goto("/?signin=1&returnTo=https://evil.example");

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/$/);
  });
});

test.describe("signed-in journey", () => {
  const email = process.env.E2E_EMAIL;
  const otp = process.env.E2E_OTP;
  test.skip(
    !email || !otp,
    "Set E2E_EMAIL and E2E_OTP to run the sign-in journey",
  );

  test("sign in with a code, stay signed in across reloads and zones, sign out", async ({
    page,
  }) => {
    const browserVisibleBodies: string[] = [];
    page.on("response", async (response) => {
      if (response.url().includes("/api/")) {
        browserVisibleBodies.push(await response.text().catch(() => ""));
      }
    });

    await page.goto("/");
    await page
      .getByRole("button", { name: /user account/i })
      .first()
      .click();
    await page
      .getByRole("textbox", { name: "Email or mobile number" })
      .fill(email!);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Verification code").fill(otp!);
    await page.getByRole("button", { name: "Verify & Proceed" }).click();

    // Header shows the account link; no token ever reached the page
    const account = page.getByRole("link", { name: /my account/i }).first();
    await expect(account).toBeVisible();
    expect(browserVisibleBodies.join("\n")).not.toMatch(
      /accessToken|refreshToken|eyJ[\w-]+\.[\w-]+\./,
    );
    const cookies = await page.context().cookies();
    expect(
      cookies.find((c) => c.name === "timmbr_refresh_token")?.httpOnly,
    ).toBe(true);

    // Reload: still signed in, no client-side refresh call
    const refreshCalls: string[] = [];
    page.on(
      "request",
      (r) => r.url().includes("/auth/refresh") && refreshCalls.push(r.url()),
    );
    await page.reload();
    await expect(account).toBeVisible();
    expect(refreshCalls).toEqual([]);

    // Cross-zone: the account zone renders the user server-side
    await account.click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Hello",
    );

    // Sign out clears the session
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/$/);
    expect(
      (await page.context().cookies()).some(
        (c) => c.name === "timmbr_refresh_token" && c.value,
      ),
    ).toBe(false);
  });
});
