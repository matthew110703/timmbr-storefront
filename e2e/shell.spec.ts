import { test, expect } from "@playwright/test";

test.describe("Ingress Shell E2E", () => {
  test("serves healthy liveness probe on /health", async ({ request }) => {
    const response = await request.get("/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.zone).toBe("shell");
    expect(data.port).toBe(3000);
  });

  test("renders platform shell homepage with design system header", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/timmbr/i);

    // Brand logo
    await expect(
      page.getByAltText("timmbr - Solid Wood Furniture"),
    ).toBeVisible();

    // Navigation links
    await expect(page.getByRole("link", { name: "Living Room" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dining Room" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bedroom" })).toBeVisible();

    // Action buttons
    await expect(page.getByRole("link", { name: /profile/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /cart/i })).toBeVisible();

    // Search trigger
    await expect(page.getByRole("button", { name: /search/i })).toBeVisible();
  });
});
