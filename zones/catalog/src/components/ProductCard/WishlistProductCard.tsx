"use client";

import { strings } from "@/app/strings";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard, type ProductCardProps } from "./ProductCard";

export interface WishlistProductCardProps extends Omit<
  ProductCardProps,
  "wishlist"
> {
  productId: string;
  /** What the heart saves (the variant the price is for); no heart without one. */
  variantId: string | null;
}

/**
 * A product card with a working wishlist heart: filled when any variant of the product is saved;
 * tapping it saves the shown (default) variant, or removes the saved one.
 */
export function WishlistProductCard({
  productId,
  variantId,
  ...card
}: WishlistProductCardProps) {
  const copy = strings.listing.card.wishlist;
  const { isProductSaved, toggle } = useWishlist(copy);
  const saved = isProductSaved(productId);

  return (
    <ProductCard
      {...card}
      wishlist={
        variantId
          ? {
              saved,
              label: saved ? copy.remove(card.title) : copy.add(card.title),
              onToggle: () => toggle(productId, variantId, "product"),
            }
          : undefined
      }
    />
  );
}
