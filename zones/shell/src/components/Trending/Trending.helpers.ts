/**
 * Helper functions for Trending showcase components.
 */

/**
 * Formats prices in Indian Rupee (INR) representation or specified currency.
 */
export function formatPrice(amount: number, currency: string = "INR"): string {
  const symbol = currency === "INR" ? "₹" : "$";
  return `${symbol} ${amount.toLocaleString("en-IN")}`;
}
