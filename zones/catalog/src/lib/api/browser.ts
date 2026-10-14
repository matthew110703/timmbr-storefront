"use client";

import { createApiClient } from "@timmbr/utils";
import type { CartSummary, WishlistEntry } from "./types";

/**
 * Changes made from the browser. Requests go to the shell's same-origin `/api/core/*`
 * pass-through: it attaches the session's access token (never in JS) and carries the guest cart
 * cookie, so signed-out shoppers have a cart too.
 */
const core = createApiClient({ baseUrl: "", apiPrefix: "/api/core" });
const NO_STORE = { cache: "no-store" as const, skipAuth: true };

export const cartApi = {
  add: (variantId: string, quantity: number) =>
    core.post<CartSummary>("/cart/items", { variantId, quantity }, NO_STORE),
};

export const wishlistApi = {
  list: () => core.get<{ items: WishlistEntry[] }>("/wishlist", NO_STORE),
  check: (variantId: string) =>
    core.get<{ inWishlist: boolean }>(`/wishlist/check/${variantId}`, NO_STORE),
  add: (variantId: string) =>
    core.post("/wishlist/items", { variantId }, NO_STORE),
  remove: (variantId: string) =>
    core.delete(`/wishlist/items/${variantId}`, NO_STORE),
};
