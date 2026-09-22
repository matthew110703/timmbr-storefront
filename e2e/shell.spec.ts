import { test, expect } from "@playwright/test";

test.describe("Ingress Shell E2E", () => {
  test("serves healthy liveness probe on /health", async ({ request }) => {
    const response = await request.get("/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.zone).toBe("shell");
    expect(data.port).toBe(8000);
  });

  test("renders platform shell homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/timmbr/i);
    await expect(page.locator("h1")).toContainText("Storefront Shell");
    await expect(
      page.getByRole("link", { name: /Check Liveness Probe/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Health Probe/i }),
    ).toBeVisible();
  });
});
