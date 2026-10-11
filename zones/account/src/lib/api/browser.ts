"use client";

import { createApiClient } from "@timmbr/utils";
import type {
  Address,
  AddressInput,
  ReverseGeocode,
  UserProfile,
} from "@/lib/api/types";

/**
 * Changes made from the browser. Requests go to the shell's same-origin
 * `/api/core/*` pass-through, which refreshes the session and attaches the
 * access token (no token in JS). After a change, call `router.refresh()` to
 * re-render the server components with fresh data.
 */
const core = createApiClient({ baseUrl: "", apiPrefix: "/api/core" });
const NO_STORE = { cache: "no-store" as const, skipAuth: true };

export const addressApi = {
  create: (input: AddressInput) =>
    core.post<Address>("/addresses", input, NO_STORE),
  update: (id: string, input: Partial<AddressInput>) =>
    core.put<Address>(`/addresses/${id}`, input, NO_STORE),
  remove: (id: string) =>
    core.delete<{ newDefaultAddressId: string | null }>(
      `/addresses/${id}`,
      NO_STORE,
    ),
  setDefault: (id: string) =>
    core.patch<Address>(`/addresses/${id}/default`, undefined, NO_STORE),
};

export const geoApi = {
  /** Address fields for a point (core keeps the geocoding key server-side). */
  reverse: (latitude: number, longitude: number) =>
    core.get<ReverseGeocode>(
      `/geo/reverse?${new URLSearchParams({ lat: String(latitude), lon: String(longitude) })}`,
      NO_STORE,
    ),
};

export const wishlistApi = {
  remove: (variantId: string) =>
    core.delete<{ variantId: string }>(
      `/wishlist/items/${variantId}`,
      NO_STORE,
    ),
};

export const cartApi = {
  add: (variantId: string, quantity = 1) =>
    core.post("/cart/items", { variantId, quantity }, NO_STORE),
};

export const userApi = {
  updateName: (name: string) =>
    core.put<UserProfile>("/user/me", { name }, NO_STORE),
};
