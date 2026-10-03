"use client";

import * as React from "react";
import Image from "next/image";
import { motion, hoverGestures, tapGestures } from "@timmbr/motion";
import type { FeaturedBanner } from "@/lib/api/types";
import { strings } from "@/app/strings";

export interface TrendingBannerCardProps {
  banner: FeaturedBanner;
}

/**
 * Interactive Client Leaf Component for Trending Featured Banner with Motion Gestures.
 */
export const TrendingBannerCard: React.FC<TrendingBannerCardProps> = ({
  banner,
}) => {
  const bannerHref = banner.cta?.primary?.path || "/products";
  const ctaLabel = banner.cta?.primary?.label || strings.trending.shopNow;

  return (
    <motion.a
      href={bannerHref}
      whileHover={hoverGestures.subtle}
      whileTap={tapGestures.compress}
      aria-label={`${banner.title} - ${ctaLabel}`}
      className="group relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-[605/480] min-h-[320px] sm:min-h-[400px] rounded-xs overflow-hidden bg-primary-600 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      {/* Banner Image */}
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Subtle Gradient Scrim on bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"
      />

      {/* Centered SHOP NOW CTA Link */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex items-center justify-center">
        <span className="font-sans font-bold text-xs sm:text-sm tracking-[2.5px] uppercase text-white border-b-2 border-white pb-0.5 transition-all group-hover:tracking-[3px] group-hover:opacity-90">
          {ctaLabel}
        </span>
      </div>
    </motion.a>
  );
};

export default TrendingBannerCard;
