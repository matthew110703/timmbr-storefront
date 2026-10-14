import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/app/strings";
import type { SavedItem } from "@/lib/api/types";
import { makeAddress, makeCart, makeLine, makeQuote } from "@/test/fixtures";
import { CheckoutView } from "./CheckoutView";

const push = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const setCartCount = vi.fn();
const setCartLines = vi.fn();
vi.mock("@timmbr/auth", () => ({
  setCartCount: (n: number) => setCartCount(n),
  setCartLines: (lines: unknown) => setCartLines(lines),
}));

const pay = vi.fn();
let paymentState = { busy: false, error: null as string | null, phase: "idle" };
let paymentOptions: { onSuccess?: (r: { orderId: string }) => void } = {};
const quote = vi.fn();
vi.mock("@timmbr/payments", () => ({
  usePayment: (options: typeof paymentOptions) => {
    paymentOptions = options;
    return {
      ...paymentState,
      orderId: null,
      pay,
      retry: vi.fn(),
      reset: vi.fn(),
    };
  },
  paymentsApi: { quote: (...args: unknown[]) => quote(...args) },
  paymentErrorMessage: () => "quote failed",
}));

const cartAdd = vi.fn();
const cartRemove = vi.fn();
const cartUpdate = vi.fn();
const wishlistAdd = vi.fn();
const wishlistRemove = vi.fn();
vi.mock("@/lib/api/browser", () => ({
  cartApi: {
    add: (...a: unknown[]) => cartAdd(...a),
    remove: (...a: unknown[]) => cartRemove(...a),
    updateQuantity: (...a: unknown[]) => cartUpdate(...a),
  },
  wishlistApi: {
    add: (...a: unknown[]) => wishlistAdd(...a),
    remove: (...a: unknown[]) => wishlistRemove(...a),
  },
}));

const savedItem: SavedItem = {
  variantId: "variant-9",
  productId: "product-9",
  product: { title: "Oak Side Table", slug: "oak-side-table" },
  variant: { price: 4999, currency: "INR", compareAtPrice: null },
  thumbnail: null,
  isAvailable: true,
};

const renderView = (
  props: Partial<React.ComponentProps<typeof CheckoutView>> = {},
) =>
  render(
    <CheckoutView
      cart={makeCart()}
      addresses={[makeAddress()]}
      initialQuote={makeQuote()}
      {...props}
    />,
  );

const payButton = () => screen.getByRole("button", { name: /^Pay\s?(₹|$)/ });
const chip = (label: string) =>
  screen.getByRole("radio", { name: new RegExp(label) });
const stepButton = (title: string) =>
  screen.getByRole("button", { name: new RegExp(`^${title}`) });

describe("CheckoutView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    paymentState = { busy: false, error: null, phase: "idle" };
    for (const mock of [
      cartAdd,
      cartRemove,
      cartUpdate,
      wishlistAdd,
      wishlistRemove,
    ]) {
      mock.mockResolvedValue({});
    }
  });

  describe("the page", () => {
    it("shows the cart, the address, core's total and a single Pay button", () => {
      renderView();

      expect(
        screen.getByText("Herrin Boucle Barrel Chair"),
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Sandesh Rao/).length).toBeGreaterThan(0);
      expect(screen.getByTestId("grand-total")).toHaveTextContent("₹19,999");
      expect(payButton()).toHaveTextContent("₹19,999");
      expect(payButton()).toBeEnabled();
    });

    it("pays for the lines and address, preselecting UPI", () => {
      renderView();

      fireEvent.click(payButton());

      expect(pay).toHaveBeenCalledWith({
        items: [{ variantId: "variant-1", quantity: 1 }],
        shippingAddressId: "addr-1",
        method: "upi",
        prefill: { name: "Sandesh Rao", contact: "9741791394" },
      });
    });

    it("blocks payment above the online limit and says why", () => {
      renderView({
        initialQuote: makeQuote({ grandTotal: 592989, subtotal: 592989 }),
      });

      expect(screen.getByText(/can.t be paid online/)).toBeInTheDocument();
      expect(payButton()).toBeDisabled();
    });

    it("locks Pay while a payment is in progress", () => {
      paymentState = { busy: true, error: null, phase: "awaiting" };
      renderView();

      expect(
        screen.getByRole("button", { name: /opening payment/i }),
      ).toBeDisabled();
    });

    it("shows a payment error from the hook", () => {
      paymentState = {
        busy: false,
        error: "Your payment did not go through.",
        phase: "failed",
      };
      renderView();

      expect(
        screen.getAllByText("Your payment did not go through.").length,
      ).toBeGreaterThan(0);
    });

    it("clears the cart badge, remembers the method and opens the confirmation once paid", () => {
      renderView();
      fireEvent.click(chip("Card"));

      paymentOptions.onSuccess?.({ orderId: "order 1" });

      expect(setCartCount).toHaveBeenCalledWith(0);
      expect(window.localStorage.getItem("timmbr.checkout.method")).toBe(
        "card",
      );
      expect(push).toHaveBeenCalledWith("/success?orderId=order%201");
    });
  });

  describe("steps (phones)", () => {
    it("opens the cart first, and the delivery step when there is no address", () => {
      const { unmount } = renderView();
      expect(stepButton("Cart")).toHaveAttribute("aria-expanded", "true");
      expect(stepButton("Delivery")).toHaveAttribute("aria-expanded", "false");
      unmount();

      renderView({ addresses: [], initialQuote: null });
      expect(stepButton("Delivery")).toHaveAttribute("aria-expanded", "true");
    });

    it("summarises each step and moves on with the continue buttons", () => {
      renderView();

      // Closed steps show what is chosen so far.
      expect(
        screen.getByText("Sandesh Rao · Chintamani 563125"),
      ).toBeInTheDocument();
      expect(screen.getByText("Pay with UPI")).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: strings.steps.next.delivery }),
      );
      expect(stepButton("Delivery")).toHaveAttribute("aria-expanded", "true");
      expect(stepButton("Cart")).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(
        screen.getByRole("button", { name: strings.steps.next.pay }),
      );
      expect(stepButton("Payment")).toHaveAttribute("aria-expanded", "true");
    });

    it("cannot continue to delivery while a line is unavailable", () => {
      renderView({
        cart: makeCart([
          makeLine(),
          makeLine({ id: "i2", variantId: "v2", isAvailable: false }),
        ]),
      });

      expect(
        screen.getByText(strings.cart.unavailableNotice),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: strings.steps.next.delivery }),
      ).toBeDisabled();
      expect(payButton()).toBeDisabled();
    });

    it("asks for an address when there is none", () => {
      renderView({ addresses: [], initialQuote: null });

      expect(
        screen.getByText(strings.address.missingTitle),
      ).toBeInTheDocument();
      expect(payButton()).toBeDisabled();
      expect(screen.getByText(strings.pay.needAddress)).toBeInTheDocument();
    });
  });

  describe("payment method chips", () => {
    it("passes the chosen method to the payment", () => {
      renderView();

      fireEvent.click(chip("Net banking"));
      fireEvent.click(payButton());

      expect(pay).toHaveBeenCalledWith(
        expect.objectContaining({ method: "netbanking" }),
      );
    });

    it("preselects, and marks, the method paid with last time", () => {
      window.localStorage.setItem("timmbr.checkout.method", "emi");
      renderView();

      expect(chip("EMI")).toBeChecked();
      expect(screen.getByText(strings.payment.lastUsed)).toBeInTheDocument();
      fireEvent.click(payButton());
      expect(pay).toHaveBeenCalledWith(
        expect.objectContaining({ method: "emi" }),
      );
    });

    it("ignores a stored value it does not know", () => {
      window.localStorage.setItem("timmbr.checkout.method", "bitcoin");
      renderView();

      expect(chip("UPI")).toBeChecked();
    });
  });

  describe("cart changes", () => {
    it("removes a line and refreshes the page", async () => {
      renderView();

      fireEvent.click(
        screen.getByRole("button", {
          name: strings.cart.removeAria("Herrin Boucle Barrel Chair"),
        }),
      );

      await waitFor(() => expect(cartRemove).toHaveBeenCalledWith("item-1"));
      await waitFor(() => expect(refresh).toHaveBeenCalled());
    });

    it("changes a quantity through core", async () => {
      renderView();

      fireEvent.click(
        screen.getByRole("button", { name: strings.cart.quantity.increase }),
      );

      await waitFor(() => expect(cartUpdate).toHaveBeenCalledWith("item-1", 2));
      await waitFor(() => expect(refresh).toHaveBeenCalled());
    });

    it("does not refresh when core refuses the change", async () => {
      cartRemove.mockRejectedValue(new Error("boom"));
      renderView();

      fireEvent.click(
        screen.getByRole("button", {
          name: strings.cart.removeAria("Herrin Boucle Barrel Chair"),
        }),
      );

      await waitFor(() => expect(cartRemove).toHaveBeenCalled());
      expect(refresh).not.toHaveBeenCalled();
    });

    it("saves a line for later: onto the wishlist, then out of the cart", async () => {
      renderView();

      fireEvent.click(
        screen.getByRole("button", {
          name: strings.cart.saveForLaterAria("Herrin Boucle Barrel Chair"),
        }),
      );

      await waitFor(() => expect(cartRemove).toHaveBeenCalledWith("item-1"));
      expect(wishlistAdd).toHaveBeenCalledWith("variant-1");
      expect(wishlistAdd.mock.invocationCallOrder[0]).toBeLessThan(
        cartRemove.mock.invocationCallOrder[0]!,
      );
      await waitFor(() => expect(refresh).toHaveBeenCalled());
    });
  });

  describe("saved for later", () => {
    it("is not shown when nothing is saved", () => {
      renderView();

      expect(screen.queryByTestId("saved-for-later")).not.toBeInTheDocument();
    });

    it("lists saved items and moves one into the cart", async () => {
      renderView({ saved: [savedItem] });

      expect(screen.getByText(strings.saved.title(1))).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", {
          name: strings.saved.moveToCartAria("Oak Side Table"),
        }),
      );

      await waitFor(() => expect(cartAdd).toHaveBeenCalledWith("variant-9", 1));
      expect(wishlistRemove).toHaveBeenCalledWith("variant-9");
      await waitFor(() => expect(refresh).toHaveBeenCalled());
    });

    it("cannot move a sold-out item", () => {
      renderView({ saved: [{ ...savedItem, isAvailable: false }] });

      expect(screen.getByText(strings.saved.soldOut)).toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: strings.saved.moveToCartAria("Oak Side Table"),
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("cart count", () => {
    it("shows the live item count on the Cart step", () => {
      renderView({ cart: makeCart([makeLine({ quantity: 2 })]) });

      expect(screen.getByTestId("step-cart-count")).toHaveTextContent("2");
    });

    it("follows the cart once the page refreshes with a new cart (e.g. after Move to cart)", () => {
      quote.mockResolvedValue(makeQuote());
      const view = renderView({ saved: [savedItem] });
      expect(screen.getByTestId("step-cart-count")).toHaveTextContent("1");
      expect(setCartLines).toHaveBeenLastCalledWith([
        { variantId: "variant-1", quantity: 1 },
      ]);

      view.rerender(
        <CheckoutView
          cart={makeCart([
            makeLine(),
            makeLine({ id: "item-9", variantId: "variant-9", quantity: 1 }),
          ])}
          addresses={[makeAddress()]}
          initialQuote={makeQuote()}
          saved={[]}
        />,
      );

      expect(screen.getByTestId("step-cart-count")).toHaveTextContent("2");
      expect(setCartLines).toHaveBeenLastCalledWith([
        { variantId: "variant-1", quantity: 1 },
        { variantId: "variant-9", quantity: 1 },
      ]);
      expect(screen.queryByTestId("saved-for-later")).not.toBeInTheDocument();
    });
  });

  describe("saved for later on phones", () => {
    it("starts closed, so it does not push the steps down, and opens on tap", () => {
      renderView({ saved: [savedItem] });
      const toggle = within(screen.getByTestId("saved-for-later")).getByRole(
        "button",
        { name: /Saved for later/ },
      );

      expect(toggle).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("guards", () => {
    it("ignores a second cart change while one is still in flight", async () => {
      let finish!: () => void;
      cartUpdate.mockReturnValue(
        new Promise<void>((resolve) => (finish = resolve)),
      );
      renderView();
      const plus = screen.getByRole("button", {
        name: strings.cart.quantity.increase,
      });

      fireEvent.click(plus);
      fireEvent.click(plus);
      fireEvent.click(plus);
      finish();

      await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
      expect(cartUpdate).toHaveBeenCalledTimes(1);
    });

    it("does not let the shopper pay again once the payment succeeded and the page is leaving", () => {
      paymentState = { busy: false, error: null, phase: "success" };
      renderView();

      const button = screen.getByRole("button", { name: /payment received/i });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(pay).not.toHaveBeenCalled();
    });

    it("keeps the last total on screen, dimmed, while a new one loads, but blocks paying", async () => {
      let answer!: (q: ReturnType<typeof makeQuote>) => void;
      quote.mockReturnValue(new Promise((resolve) => (answer = resolve)));
      renderView({
        addresses: [
          makeAddress({ id: "addr-1" }),
          makeAddress({ id: "addr-2", fname: "Asha", isDefault: false }),
        ],
      });

      fireEvent.click(
        screen.getByRole("button", { name: strings.address.change }),
      );
      fireEvent.click(screen.getByRole("radio", { name: /Asha/ }));
      fireEvent.click(
        screen.getByRole("button", { name: strings.address.pickerDone }),
      );

      await waitFor(() => expect(quote).toHaveBeenCalled());
      expect(screen.getByTestId("grand-total")).toHaveTextContent("₹19,999");
      expect(payButton()).toBeDisabled();

      answer(makeQuote({ grandTotal: 20500, subtotal: 20500 }));
      await waitFor(() =>
        expect(screen.getByTestId("grand-total")).toHaveTextContent("₹20,500"),
      );
      expect(payButton()).toBeEnabled();
    });
  });

  it("asks core for a new price when the address changes", async () => {
    quote.mockResolvedValue(makeQuote({ grandTotal: 20500, subtotal: 20500 }));
    renderView({
      addresses: [
        makeAddress({ id: "addr-1" }),
        makeAddress({ id: "addr-2", fname: "Asha", isDefault: false }),
      ],
    });

    fireEvent.click(
      screen.getByRole("button", { name: strings.address.change }),
    );
    fireEvent.click(screen.getByRole("radio", { name: /Asha/ }));
    fireEvent.click(
      screen.getByRole("button", { name: strings.address.pickerDone }),
    );

    await waitFor(() =>
      expect(quote).toHaveBeenCalledWith(
        [{ variantId: "variant-1", quantity: 1 }],
        "addr-2",
      ),
    );
    await waitFor(() =>
      expect(screen.getByTestId("grand-total")).toHaveTextContent("₹20,500"),
    );
  });
});
