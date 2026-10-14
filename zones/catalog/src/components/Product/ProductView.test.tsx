import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@timmbr/utils";
import { BED } from "./fixtures";

const cartApi = vi.hoisted(() => ({ add: vi.fn() }));
// A tiny cart mirror standing in for @timmbr/auth's store (quantities per variant, live).
const cartStore = vi.hoisted(() => {
  let lines: Record<string, number> = {};
  const listeners = new Set<() => void>();
  return {
    get: (id: string) => lines[id] ?? 0,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setLines: vi.fn((items: { variantId: string; quantity: number }[]) => {
      lines = {};
      for (const item of items)
        lines[item.variantId] = (lines[item.variantId] ?? 0) + item.quantity;
      listeners.forEach((listener) => listener());
    }),
    bump: vi.fn(),
    reset: () => {
      lines = {};
    },
  };
});
vi.mock("@/lib/api/browser", () => ({
  cartApi,
  wishlistApi: { check: vi.fn(), add: vi.fn(), remove: vi.fn() },
}));
vi.mock("@timmbr/auth", async () => {
  const React = await import("react");
  return {
    useSession: () => ({ status: "anonymous", user: null }),
    openAuthModal: vi.fn(),
    setCartLines: cartStore.setLines,
    bumpCartCount: cartStore.bump,
    useCartQuantity: (id: string) =>
      React.useSyncExternalStore(cartStore.subscribe, () => cartStore.get(id)),
  };
});

import { ProductView } from "./ProductView";

const TRUST = { items: [{ icon: "shipping", label: "Free shipping*" }] };

const renderView = (initialVariantId = "walnut") =>
  render(
    <ProductView
      product={BED}
      initialVariantId={initialVariantId}
      trust={TRUST}
    />,
  );

const addButton = () =>
  screen.getAllByRole("button", { name: /add to cart/i })[0];

describe("ProductView", () => {
  beforeEach(() => {
    vi.spyOn(window.history, "replaceState");
  });
  afterEach(() => {
    vi.restoreAllMocks();
    cartApi.add.mockReset();
    cartStore.setLines.mockClear();
    cartStore.bump.mockReset();
    cartStore.reset();
    window.localStorage.clear();
  });

  it("renders the title, SKU, price and the picked finish", () => {
    renderView();
    expect(
      screen.getByRole("heading", { level: 1, name: "Hale Teak Bed" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Product ID: SKU-WALNUT/)).toBeInTheDocument();
    expect(
      screen.getByRole("radiogroup", { name: "Finish: Walnut" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Free shipping*")).toBeInTheDocument();
  });

  it("switches variant in place: price, SKU, stock line and the URL", () => {
    renderView();
    fireEvent.click(screen.getByRole("radio", { name: "Honey" }));

    expect(screen.getByText(/Product ID: SKU-HONEY/)).toBeInTheDocument();
    expect(
      screen.getByText("Please hurry! Only 2 left in stock"),
    ).toBeInTheDocument();
    expect(window.history.replaceState).toHaveBeenLastCalledWith(
      null,
      "",
      "/products/hale-teak-bed?finish=honey",
    );
  });

  it("disables buying a sold-out finish but keeps it selectable", () => {
    renderView();
    fireEvent.click(screen.getByRole("radio", { name: "White, Out of stock" }));
    expect(
      screen.getAllByRole("button", { name: "Sold out" })[0],
    ).toBeDisabled();
    expect(screen.getByText(/This option is sold out/)).toBeInTheDocument();
  });

  it("adds to the cart once, with the header count moving at once and settling on core's answer", async () => {
    let resolve!: (value: unknown) => void;
    cartApi.add.mockReturnValue(new Promise((r) => (resolve = r)));
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    const button = addButton();
    fireEvent.click(button);
    // A second click while the first is in flight does nothing (the button shows "Adding…").
    fireEvent.click(button);
    expect(button).toHaveTextContent("Adding…");

    expect(cartApi.add).toHaveBeenCalledTimes(1);
    expect(cartApi.add).toHaveBeenCalledWith("walnut", 2);
    expect(cartStore.bump).toHaveBeenCalledWith(2);

    await act(async () =>
      resolve({ items: [{ variantId: "walnut", quantity: 3 }] }),
    );
    expect(cartStore.setLines).toHaveBeenCalledWith([
      { variantId: "walnut", quantity: 3 },
    ]);
  });

  it("leads to the cart once the variant is in it, and lets the shopper add more", async () => {
    cartApi.add.mockResolvedValue({
      items: [{ variantId: "walnut", quantity: 1 }],
    });
    renderView();

    fireEvent.click(addButton());

    const goToCart = await screen.findAllByRole("link", {
      name: /go to cart/i,
    });
    expect(goToCart[0]).toHaveAttribute("href", "/checkout");
    expect(screen.getByText("1 in your cart")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add to cart/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add more" }));
    expect(addButton()).toBeEnabled();

    // Another finish isn't in the cart: it shows Add to cart.
    fireEvent.click(screen.getByRole("radio", { name: "Honey" }));
    expect(addButton()).toBeEnabled();
  });

  it("rolls back and explains a stock refusal next to the button", async () => {
    cartApi.add.mockRejectedValue(
      new ApiError(
        409,
        "Only 1 left in stock.",
        { code: "CART_ITEM_OUT_OF_STOCK", details: { available: 1 } },
        "CART_ITEM_OUT_OF_STOCK",
      ),
    );
    renderView();

    fireEvent.click(addButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Only 1 left. Lower the quantity to add it.",
    );
    expect(cartStore.bump).toHaveBeenLastCalledWith(-1);
  });

  it("caps the quantity at what the variant has", () => {
    renderView("honey");
    const plus = screen.getByRole("button", { name: "Increase quantity" });
    fireEvent.click(plus);
    expect(plus).toBeDisabled();
  });

  it("remembers the product as recently viewed", async () => {
    renderView();
    await waitFor(() =>
      expect(
        JSON.parse(window.localStorage.getItem("timmbr:recently-viewed:v1")!),
      ).toMatchObject([{ slug: "hale-teak-bed", price: 32999 }]),
    );
  });
});
