import type { Metadata } from "next";
import type { CheckoutQuote } from "@timmbr/payments/contract";
import { isApiError } from "@timmbr/utils";
import { CheckoutView } from "@/components/CheckoutView";
import { EmptyCheckout } from "@/components/EmptyCheckout";
import { serverGet, serverPost } from "@/lib/api/server";
import type { Address, Cart, SavedItem, Wishlist } from "@/lib/api/types";
import { pickInitialAddress, toCheckoutItems } from "@/lib/checkout";
import { strings } from "./strings";

export const metadata: Metadata = {
  title: strings.metadata.title,
  description: strings.metadata.description,
};

/** Core's price for the lines and address, or null when it can't be had (shown as an error). */
async function quoteFor(
  cart: Cart,
  address: Address | null,
): Promise<CheckoutQuote | null> {
  const items = toCheckoutItems(cart.items);
  if (!address || items.length === 0) return null;
  try {
    return await serverPost<CheckoutQuote>("/checkout/quote", {
      items,
      shippingAddressId: address.id,
    });
  } catch (error) {
    // The client asks again and explains; only a broken session or core outage is fatal here.
    if (isApiError(error) && error.statusCode >= 400 && error.statusCode < 500)
      return null;
    throw error;
  }
}

/** The wishlist is a convenience: if it cannot be read, checkout still works without it. */
async function savedItems(): Promise<SavedItem[]> {
  try {
    return (await serverGet<Wishlist>("/wishlist")).items;
  } catch {
    return [];
  }
}

export default async function CheckoutPage() {
  const [cart, addresses, saved] = await Promise.all([
    serverGet<Cart>("/cart"),
    serverGet<Address[]>("/addresses"),
    savedItems(),
  ]);

  if (cart.items.length === 0) return <EmptyCheckout />;

  const initialQuote = await quoteFor(cart, pickInitialAddress(addresses));

  return (
    <CheckoutView
      cart={cart}
      addresses={addresses}
      initialQuote={initialQuote}
      saved={saved}
    />
  );
}
