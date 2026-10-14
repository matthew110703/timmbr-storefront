import type { CheckoutItem } from "@timmbr/payments/contract";
import type { Address, CartLine } from "@/lib/api/types";

/** Lines that can be bought right now (withdrawn or sold-out ones can't be paid for). */
export function payableLines(lines: CartLine[]): CartLine[] {
  return lines.filter((line) => line.isAvailable && line.availableQuantity > 0);
}

/** The lines core is asked to price and charge. */
export function toCheckoutItems(lines: CartLine[]): CheckoutItem[] {
  return payableLines(lines).map(({ variantId, quantity }) => ({
    variantId,
    quantity,
  }));
}

/** The default address, else the first one, else none. */
export function pickInitialAddress(addresses: Address[]): Address | null {
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}

/** "Deccan Hospital Dead End Road, Chintamani, Karnataka, 563125" */
export function addressText(address: Address): string {
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function addressName(address: Address): string {
  return [address.fname, address.lname].filter(Boolean).join(" ");
}
