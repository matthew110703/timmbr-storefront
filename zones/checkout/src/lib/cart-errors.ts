import { isApiError } from "@timmbr/utils";
import { strings } from "@/app/strings";

const t = strings.cart;

/** The fields core puts in an error's `details` (e.g. `available`, `max`). */
function errorDetails(error: unknown): Record<string, unknown> {
  if (!isApiError(error) || typeof error.details !== "object" || !error.details)
    return {};
  const body = error.details as { details?: unknown };
  return typeof body.details === "object" && body.details
    ? (body.details as Record<string, unknown>)
    : {};
}

/** User-facing copy for a failed cart change. */
export function cartErrorMessage(error: unknown): string {
  const code = isApiError(error) ? error.code : undefined;
  const details = errorDetails(error);

  if (code === "CART_ITEM_OUT_OF_STOCK") {
    return t.outOfStock(Number(details.available ?? 0));
  }
  if (code === "CART_QUANTITY_LIMIT") {
    return t.quantityLimit(Number(details.max ?? 10));
  }
  return t.updateFailed;
}
