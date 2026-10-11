import * as React from "react";
import type { ProductItem } from "@/lib/api/types";
import { MOCK_FALLBACK_PRODUCT_IMAGE } from "@/app/mock";
import { strings } from "@/app/strings";
import { ProductCard } from "@/components/ProductCard";

export interface TrendingProductCardProps {
  product: ProductItem;
}

/** A product in the Trending track: the storefront ProductCard at a fixed track width. */
export const TrendingProductCard: React.FC<TrendingProductCardProps> = ({
  product,
}) => (
  <ProductCard
    as="div"
    className="w-[240px] shrink-0 snap-start sm:w-[280px] lg:w-[293px]"
    title={product.title}
    href={`/products/${product.slug || product.id}`}
    image={product.coverImage?.url || MOCK_FALLBACK_PRODUCT_IMAGE}
    imageAlt={product.coverImage?.altText || product.title}
    imageSizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 293px"
    price={product.price}
    compareAtPrice={product.compareAtPrice}
    currency={product.currency ?? "INR"}
    optionsLabel={
      product.hasMultipleVariants ? strings.trending.options : undefined
    }
  />
);

export default TrendingProductCard;
