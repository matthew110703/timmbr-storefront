import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ status: "authenticated" as string }));
const openAuthModal = vi.hoisted(() => vi.fn());
const wishlistApi = vi.hoisted(() => ({
  list: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  check: vi.fn(),
}));
vi.mock("@timmbr/auth", () => ({
  useSession: () => ({ status: session.status, user: null }),
  openAuthModal,
}));
vi.mock("@/lib/api/browser", () => ({
  wishlistApi,
  cartApi: { add: vi.fn() },
}));

import { __resetWishlistForTests } from "@/lib/wishlist";
import { WishlistProductCard } from "./WishlistProductCard";

const card = (productId = "p1", variantId: string | null = "v1") => (
  <WishlistProductCard
    as="div"
    productId={productId}
    variantId={variantId}
    title="Hale Teak Bed"
    href="/products/hale-teak-bed"
    image={null}
    price={32999}
    currency="INR"
  />
);

describe("WishlistProductCard", () => {
  afterEach(() => {
    __resetWishlistForTests();
    vi.clearAllMocks();
    session.status = "authenticated";
  });

  it("fills the heart when any variant of the product is saved (one request for all cards)", async () => {
    wishlistApi.list.mockResolvedValue({
      items: [{ productId: "p1", variantId: "v-other" }],
    });
    render(
      <>
        {card("p1")}
        {card("p2", "v2")}
      </>,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "Remove Hale Teak Bed from wishlist",
        }),
      ).toHaveAttribute("aria-pressed", "true"),
    );
    expect(wishlistApi.list).toHaveBeenCalledTimes(1);
  });

  it("saves the default variant, and removes whichever variant was saved", async () => {
    wishlistApi.list.mockResolvedValue({ items: [] });
    wishlistApi.add.mockResolvedValue({});
    wishlistApi.remove.mockResolvedValue({});
    render(card());
    await waitFor(() => expect(wishlistApi.list).toHaveBeenCalled());

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Save Hale Teak Bed to wishlist" }),
      );
    });
    expect(wishlistApi.add).toHaveBeenCalledWith("v1");

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Remove Hale Teak Bed from wishlist",
        }),
      );
    });
    expect(wishlistApi.remove).toHaveBeenCalledWith("v1");
  });

  it("asks a signed-out shopper to sign in first", () => {
    session.status = "anonymous";
    render(card());
    fireEvent.click(
      screen.getByRole("button", { name: "Save Hale Teak Bed to wishlist" }),
    );
    expect(openAuthModal).toHaveBeenCalled();
    expect(wishlistApi.add).not.toHaveBeenCalled();
  });

  it("has no heart without a variant to save", () => {
    session.status = "anonymous";
    render(card("p1", null));
    expect(
      screen.queryByRole("button", { name: /wishlist/ }),
    ).not.toBeInTheDocument();
  });
});
