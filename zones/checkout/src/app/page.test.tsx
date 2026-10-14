import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@timmbr/utils";
import { makeAddress, makeCart, makeLine, makeQuote } from "@/test/fixtures";
import CheckoutPage from "./page";
import { strings } from "./strings";

const serverGet = vi.fn();
const serverPost = vi.fn();
vi.mock("@/lib/api/server", () => ({
  serverGet: (...args: unknown[]) => serverGet(...args),
  serverPost: (...args: unknown[]) => serverPost(...args),
}));

const view = vi.fn();
vi.mock("@/components/CheckoutView", () => ({
  CheckoutView: (props: unknown) => {
    view(props);
    return <div data-testid="checkout-view" />;
  },
}));

function loads(cart: unknown, addresses: unknown) {
  serverGet.mockImplementation((path: string) =>
    Promise.resolve(path === "/cart" ? cart : addresses),
  );
}

describe("Checkout page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the empty state for an empty cart", async () => {
    loads(makeCart([]), [makeAddress()]);

    render(await CheckoutPage());

    expect(screen.getByText(strings.empty.title)).toBeInTheDocument();
    expect(serverPost).not.toHaveBeenCalled();
  });

  it("prices the cart for the default address and hands everything to the view", async () => {
    const cart = makeCart();
    const quote = makeQuote();
    loads(cart, [
      makeAddress({ id: "other", isDefault: false }),
      makeAddress(),
    ]);
    serverPost.mockResolvedValue(quote);

    render(await CheckoutPage());

    expect(serverPost).toHaveBeenCalledWith("/checkout/quote", {
      items: [{ variantId: "variant-1", quantity: 1 }],
      shippingAddressId: "addr-1",
    });
    expect(view).toHaveBeenCalledWith(
      expect.objectContaining({ cart, initialQuote: quote }),
    );
  });

  it("does not ask for a price without an address", async () => {
    loads(makeCart(), []);

    render(await CheckoutPage());

    expect(serverPost).not.toHaveBeenCalled();
    expect(view).toHaveBeenCalledWith(
      expect.objectContaining({ initialQuote: null }),
    );
  });

  it("leaves the price to the client when core refuses the quote", async () => {
    loads(makeCart([makeLine({ quantity: 99 })]), [makeAddress()]);
    serverPost.mockRejectedValue(
      new ApiError(422, "stock", undefined, "INSUFFICIENT_STOCK"),
    );

    render(await CheckoutPage());

    expect(view).toHaveBeenCalledWith(
      expect.objectContaining({ initialQuote: null }),
    );
  });

  it("does not hide a core outage", async () => {
    loads(makeCart(), [makeAddress()]);
    serverPost.mockRejectedValue(new ApiError(503, "down"));

    await expect(CheckoutPage()).rejects.toThrow();
  });
});
