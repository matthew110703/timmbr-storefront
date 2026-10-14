import type { CheckoutQuote } from "@timmbr/payments/contract";
import type { Address, Cart, CartLine } from "@/lib/api/types";

export function makeLine(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: "item-1",
    variantId: "variant-1",
    productId: "product-1",
    name: "Herrin Boucle Barrel Chair",
    sku: "CHAIR-1",
    quantity: 1,
    unitPrice: "19999",
    totalPrice: "19999",
    currency: "INR",
    thumbnail: null,
    attributes: { Colour: "Ivory" },
    isAvailable: true,
    availableQuantity: 10,
    ...overrides,
  };
}

export function makeCart(lines: CartLine[] = [makeLine()]): Cart {
  const total = lines.reduce((sum, line) => sum + Number(line.totalPrice), 0);
  return {
    id: "cart-1",
    items: lines,
    subtotal: String(total),
    grandTotal: String(total),
    currency: "INR",
  };
}

export function makeAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: "addr-1",
    fname: "Sandesh",
    lname: "Rao",
    phone: "9741791394",
    line1: "Deccan Hospital Dead End Road",
    line2: null,
    city: "Chintamani",
    state: "Karnataka",
    postalCode: "563125",
    country: "India",
    label: "home",
    isDefault: true,
    ...overrides,
  };
}

export function makeQuote(
  overrides: Partial<CheckoutQuote> = {},
): CheckoutQuote {
  return {
    items: [],
    subtotal: 19999,
    discount: 0,
    shippingFee: 0,
    tax: 3050,
    grandTotal: 19999,
    currency: "INR",
    paymentLimit: 500000,
    ...overrides,
  };
}
