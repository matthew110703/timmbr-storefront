import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@timmbr/utils";
import SuccessPage from "./page";
import { strings } from "./strings";

const serverGet = vi.fn();
vi.mock("@/lib/api/server", () => ({
  serverGet: (...args: unknown[]) => serverGet(...args),
}));

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));

const order = (status: string) => ({
  id: "abcdef12-0000",
  status,
  grandTotal: 19999,
  currency: "INR",
  placedAt: null,
  items: [{ id: "i1", name: "Chair", quantity: 2 }],
});

const page = (orderId?: string) =>
  SuccessPage({ searchParams: Promise.resolve({ orderId }) });

describe("Success page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("confirms a placed order with its total and links", async () => {
    serverGet.mockResolvedValue(order("CONFIRMED"));

    render(await page("order-1"));

    expect(serverGet).toHaveBeenCalledWith("/orders/order-1", {
      returnTo: "/checkout",
    });
    expect(screen.getByText(strings.confirmed.title)).toBeInTheDocument();
    expect(screen.getByText(/#ABCDEF12/)).toBeInTheDocument();
    expect(screen.getByText(/₹19,999/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: strings.viewOrder }),
    ).toHaveAttribute("href", "/account/orders/abcdef12-0000");
  });

  it("does not claim success while the payment is still being confirmed", async () => {
    serverGet.mockResolvedValue(order("PENDING"));

    render(await page("order-1"));

    expect(screen.getByText(strings.processing.title)).toBeInTheDocument();
    expect(screen.queryByText(strings.confirmed.title)).not.toBeInTheDocument();
  });

  it("is a 404 without an order id", async () => {
    await expect(page()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(serverGet).not.toHaveBeenCalled();
  });

  it.each([403, 404])("is a 404 when core answers %s", async (status) => {
    serverGet.mockRejectedValue(new ApiError(status, "nope"));

    await expect(page("order-1")).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
