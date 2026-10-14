import type { PaymentMethod } from "@timmbr/payments/contract";

const KEY = "timmbr.checkout.method";
const METHODS: readonly PaymentMethod[] = ["upi", "card", "netbanking", "emi"];

/**
 * The payment method the shopper paid with last time, kept in this browser only. Storage can be
 * blocked or throw (private windows), so every access is guarded and the page works without it.
 */
export function readLastMethod(): PaymentMethod | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return METHODS.includes(value as PaymentMethod)
      ? (value as PaymentMethod)
      : null;
  } catch {
    return null;
  }
}

export function writeLastMethod(method: PaymentMethod): void {
  try {
    window.localStorage.setItem(KEY, method);
  } catch {
    // Not remembered; nothing else depends on it.
  }
}
