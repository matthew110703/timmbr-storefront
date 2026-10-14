import { describe, expect, it } from "vitest";
import { ApiError } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { cartErrorMessage } from "./cart-errors";

const error = (code: string, details?: unknown) =>
  new ApiError(422, "nope", { details }, code);

describe("cartErrorMessage", () => {
  it("names how many are left when stock runs out", () => {
    expect(
      cartErrorMessage(error("CART_ITEM_OUT_OF_STOCK", { available: 2 })),
    ).toBe(strings.cart.outOfStock(2));
  });

  it("names the per-item limit", () => {
    expect(cartErrorMessage(error("CART_QUANTITY_LIMIT", { max: 5 }))).toBe(
      strings.cart.quantityLimit(5),
    );
  });

  it("falls back to a generic message", () => {
    expect(cartErrorMessage(error("SOMETHING_ELSE"))).toBe(
      strings.cart.updateFailed,
    );
    expect(cartErrorMessage(new Error("boom"))).toBe(strings.cart.updateFailed);
  });
});
