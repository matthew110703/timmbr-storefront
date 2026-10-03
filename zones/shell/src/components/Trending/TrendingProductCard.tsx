"use client";

import * as React from "react";
import Image from "next/image";
import { Card, Text, Stack, Inline } from "@timmbr/ui";
import { motion, hoverGestures, tapGestures } from "@timmbr/motion";
import type { ProductItem } from "@/lib/api/types";
import { MOCK_FALLBACK_PRODUCT_IMAGE } from "@/app/mock";
import { formatPrice } from "./Trending.helpers";

export interface TrendingProductCardProps {
  product: ProductItem;
}

/**
 * Interactive Client Leaf Component for Trending Product Card with Motion Gestures.
 * Wrapped with @timmbr/ui Card primitive using asChild delegation.
 */
export const TrendingProductCard: React.FC<TrendingProductCardProps> = ({
  product,
}) => {
  const productHref = `/products/${product.slug || product.id}`;
  const imageUrl = product.coverImage?.url || MOCK_FALLBACK_PRODUCT_IMAGE;
  const altText = product.coverImage?.altText || product.title;

  return (
    <Card
      asChild
      variant="interactive"
      padding="none"
      className="shrink-0 w-[240px] sm:w-[280px] lg:w-[293px] snap-start border-none bg-transparent shadow-none"
    >
      <motion.a
        href={productHref}
        whileHover={hoverGestures.lift}
        whileTap={tapGestures.compress}
        aria-label={`View ${product.title}`}
        className="group flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-800"
      >
        {/* Product Photo Box (1:1 Aspect Ratio) */}
        <div className="relative aspect-square w-full bg-white rounded-xs border border-border-warm/60 overflow-hidden shadow-2xs transition-shadow group-hover:shadow-sm">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 293px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Product Details (Title & Price) */}
        <Stack gap={1} className="w-full text-left">
          <Text
            as="span"
            variant="body-1"
            weight="semibold"
            className="text-sm sm:text-base text-grey-800 truncate leading-tight group-hover:text-primary-1000 transition-colors"
          >
            {product.title}
          </Text>
          <Inline align="center" gap={2} className="leading-tight">
            <Text
              as="span"
              variant="body-1"
              weight="bold"
              className="text-base sm:text-lg text-grey-800"
            >
              {formatPrice(product.price, product.currency)}
            </Text>
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <Text
                  as="span"
                  variant="body-2"
                  foreground="subtle"
                  className="text-xs sm:text-sm text-grey-500 line-through"
                >
                  {formatPrice(product.compareAtPrice, product.currency)}
                </Text>
              )}
          </Inline>
        </Stack>
      </motion.a>
    </Card>
  );
};

export default TrendingProductCard;
