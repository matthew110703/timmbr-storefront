"use client";

import { createApiClient } from "@timmbr/utils";
import type { Cart } from "./types";

/**
 * Cart changes made from the browser. Requests go to the shell's same-origin `/api/core/*`
 * pass-through, which attaches the session's access token (never in JS). Payment calls live in
 * `@timmbr/payments`.
 */
const core = createApiClient({ baseUrl: "", apiPrefix: "/api/core" });
const NO_STORE = { cache: "no-store" as const, skipAuth: true };

export const cartApi = {
  add: (variantId: string, quantity: number) =>
    core.post<Cart>("/cart/items", { variantId, quantity }, NO_STORE),
  updateQuantity: (itemId: string, quantity: number) =>
    core.patch<Cart>(`/cart/items/${itemId}`, { quantity }, NO_STORE),
  remove: (itemId: string) =>
    core.delete<Cart>(`/cart/items/${itemId}`, NO_STORE),
};

export const wishlistApi = {
  add: (variantId: string) =>
    core.post("/wishlist/items", { variantId }, NO_STORE),
  remove: (variantId: string) =>
    core.delete(`/wishlist/items/${variantId}`, NO_STORE),
};
