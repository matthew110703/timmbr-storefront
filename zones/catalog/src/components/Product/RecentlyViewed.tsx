"use client";

import * as React from "react";
import { useStoredList } from "@timmbr/hooks";
import type { ProductDetail } from "@/lib/api/types";
import { ProductRail } from "./ProductRail";

/** Shared by every zone (one origin), so the shell could show it too. */
export const RECENTLY_VIEWED_KEY = "timmbr:recently-viewed:v1";
const MAX_ITEMS = 12;

/** What a card needs, stored on this device only. */
export interface ViewedProduct {
  /** Older entries may lack the ids (no heart then). */
  productId?: string;
  variantId?: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  image: string | null;
  imageAlt: string;
}

const isViewed = (value: unknown): value is ViewedProduct => {
  const v = value as Partial<ViewedProduct> | null;
  return (
    !!v &&
    typeof v.slug === "string" &&
    typeof v.title === "string" &&
    typeof v.price === "number" &&
    typeof v.currency === "string"
  );
};
const bySlug = (item: ViewedProduct) => item.slug;
const OPTIONS = {
  storageKey: RECENTLY_VIEWED_KEY,
  max: MAX_ITEMS,
  getKey: bySlug,
  isItem: isViewed,
};

/** Remembers this product (default variant's price, first image) as just viewed. */
export function useRecordRecentlyViewed(product: ProductDetail) {
  const { add } = useStoredList(OPTIONS);
  React.useEffect(() => {
    const variant =
      product.variants.find((v) => v.id === product.defaultVariantId) ??
      product.variants[0];
    add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      title: product.title,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      currency: variant.currency,
      image: product.images[0]?.url ?? null,
      imageAlt: product.images[0]?.alt ?? product.title,
    });
  }, [product, add]);
}

/**
 * Products viewed on this device (no account or server data), newest first, without the one on
 * screen. Renders nothing until there's at least one: the server render is always empty.
 */
export function RecentlyViewed({
  currentSlug,
  title,
}: {
  currentSlug: string;
  title: string;
}) {
  const { items } = useStoredList(OPTIONS);
  const others = items.filter((item) => item.slug !== currentSlug);
  if (others.length === 0) return null;
  return (
    <ProductRail
      title={title}
      products={others.map((item) => ({
        key: item.slug,
        productId: item.productId ?? item.slug,
        variantId: item.productId ? (item.variantId ?? null) : null,
        title: item.title,
        href: `/products/${item.slug}`,
        image: item.image,
        imageAlt: item.imageAlt,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        currency: item.currency,
      }))}
    />
  );
}
