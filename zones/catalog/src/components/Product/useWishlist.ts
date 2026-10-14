"use client";

import { strings } from "@/app/products/[slug]/strings";
import { useWishlist as useWishlistStore } from "@/lib/wishlist";

/** The product page heart: saves exactly the selected variant (see lib/wishlist). */
export function useWishlist(productId: string, variantId: string) {
  const copy = strings.wishlist;
  const { isVariantSaved, toggle } = useWishlistStore(copy);
  const saved = isVariantSaved(variantId);
  return {
    saved,
    pending: false,
    toggle: () => toggle(productId, variantId, "variant"),
    label: saved ? copy.remove : copy.add,
  };
}
