"use client";

import { useCallback, useRef, useState } from "react";
import { bumpCartCount, setCartLines } from "@timmbr/auth";
import { toast } from "@timmbr/ui";
import { isApiError } from "@timmbr/utils";
import { strings } from "@/app/products/[slug]/strings";
import { cartApi } from "@/lib/api/browser";

/** Where "View cart" / "Go to cart" go (the checkout zone). */
export const CART_HREF = "/checkout";

export interface AddToCartError {
  message: string;
  /** Units core says are left, when it refused for stock. */
  available?: number;
}

/** `details` of core's error envelope (ApiError.details holds the whole body). */
function errorDetails(error: unknown): Record<string, unknown> {
  if (!isApiError(error) || typeof error.details !== "object" || !error.details)
    return {};
  const body = error.details as { details?: unknown };
  return typeof body.details === "object" && body.details
    ? (body.details as Record<string, unknown>)
    : {};
}

/**
 * Add to cart through the shell's /api/core proxy (guest or signed-in cart alike). The header
 * count moves at once and settles on core's answer; a refusal rolls it back and returns a
 * message for the button area (stock limits name what's left). One request at a time: clicks
 * while one is in flight are ignored.
 */
export function useAddToCart() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<AddToCartError | null>(null);
  const inFlight = useRef(false);
  const copy = strings;

  const add = useCallback(
    async (variantId: string, quantity: number, title: string) => {
      if (inFlight.current) return null;
      inFlight.current = true;
      setPending(true);
      setError(null);
      bumpCartCount(quantity);
      try {
        const cart = await cartApi.add(variantId, quantity);
        // Count and per-variant quantities from core's answer ("In your cart" follows).
        setCartLines(cart.items);
        toast.success(
          copy.added.title,
          copy.added.description(title, quantity),
          {
            action: {
              label: copy.added.viewCart,
              // The cart is another zone (checkout): a full page load, not router.push.
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              onClick: () => window.location.assign(CART_HREF),
            },
          },
        );
        return null;
      } catch (cause) {
        bumpCartCount(-quantity);
        const details = errorDetails(cause);
        const code = isApiError(cause) ? cause.code : undefined;
        let next: AddToCartError;
        if (code === "CART_ITEM_OUT_OF_STOCK") {
          const available = Number(details.available ?? 0);
          next = { message: copy.errors.outOfStock(available), available };
        } else if (code === "CART_QUANTITY_LIMIT") {
          next = { message: copy.errors.limit(Number(details.max ?? 10)) };
        } else if (code === "VARIANT_UNAVAILABLE") {
          next = { message: copy.errors.unavailable, available: 0 };
        } else {
          next = { message: copy.errors.generic };
          toast.error(copy.errors.generic);
        }
        setError(next);
        return next;
      } finally {
        inFlight.current = false;
        setPending(false);
      }
    },
    [copy],
  );

  const clearError = useCallback(() => setError(null), []);

  return { add, pending, error, clearError };
}
