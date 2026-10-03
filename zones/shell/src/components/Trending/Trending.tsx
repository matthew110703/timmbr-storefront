import * as React from "react";
import { Heading, Text, Stack } from "@timmbr/ui";
import type {
  TrendingSectionData,
  ProductItem,
  FeaturedBanner,
} from "@/lib/api/types";
import { strings } from "@/app/strings";
import { MOCK_DEFAULT_BANNERS, MOCK_FALLBACK_PRODUCTS } from "@/app/mock";
import { TrendingBannerCard } from "./TrendingBannerCard";
import { TrendingProductCard } from "./TrendingProductCard";

export interface TrendingProps {
  section?: TrendingSectionData | null;
  products?: ProductItem[];
  title?: string;
  className?: string;
}

/**
 * Shell Landing Page Trending Section (Server Component).
 * Implements the dual showcase tracks (Featured Banners & Trending Products)
 * from Figma (node-id=82-398) strictly composed with @timmbr/ui and modular client leaf cards.
 */
export const Trending: React.FC<TrendingProps> = ({
  section,
  products,
  title: titleProp,
  className,
}) => {
  const title = titleProp || section?.title || strings.trending.title;
  const description = section?.description || strings.trending.description;

  const banners =
    section?.featuredBanners && section.featuredBanners.length > 0
      ? section.featuredBanners
      : MOCK_DEFAULT_BANNERS;

  const displayProducts: readonly ProductItem[] =
    products && products.length > 0 ? products : MOCK_FALLBACK_PRODUCTS;

  return (
    <section
      title={title}
      aria-label={title}
      data-slot="shell-trending"
      className={`w-full ${className ?? ""}`}
    >
      <Stack gap={7} className="w-full">
        {/* Section Header */}
        <Stack gap={1} className="w-full">
          <Heading
            level={2}
            font="display"
            foreground="default"
            className="text-2xl sm:text-3xl lg:text-[32px] text-grey-800 tracking-tight leading-[1.3]"
          >
            {title}
          </Heading>
          <Text
            as="p"
            variant="subtitle-1"
            weight="semibold"
            foreground="default"
            className="text-grey-800 leading-[1.4]"
          >
            {description}
          </Text>
        </Stack>

        {/* 1. Featured Banners (Filled Grid) */}
        <div
          data-slot="trending-banners-grid"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {banners.map((banner: FeaturedBanner, index: number) => (
            <TrendingBannerCard key={banner.title || index} banner={banner} />
          ))}
        </div>

        {/* 2. Trending Products Track */}
        <div
          data-slot="trending-products-track"
          className="w-full overflow-x-auto pb-4 pt-1 px-1 flex gap-5 sm:gap-[19.5px] snap-x snap-mandatory scroll-smooth focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayProducts.map((product: ProductItem) => (
            <TrendingProductCard
              key={product.id || product.slug}
              product={product}
            />
          ))}
        </div>
      </Stack>
    </section>
  );
};

export default Trending;
