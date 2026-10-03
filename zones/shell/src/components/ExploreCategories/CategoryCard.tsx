"use client";

import * as React from "react";
import Image from "next/image";
import { Card, Text } from "@timmbr/ui";
import { motion, hoverGestures, tapGestures } from "@timmbr/motion";
import type { CategoryItem } from "@/lib/api/types";
import { getCategoryImage } from "./ExploreCategories.helpers";

export interface CategoryCardProps {
  category: CategoryItem;
}

/**
 * Interactive Client Leaf Component for Category Card with Design System Card & Motion Gestures.
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const imageUrl = getCategoryImage(category);
  const categoryHref = `/products?category=${encodeURIComponent(
    category.slug || category.name.toLowerCase().replace(/\s+/g, "-"),
  )}`;

  return (
    <Card
      asChild
      variant="interactive"
      padding="none"
      className="group relative shrink-0 w-[240px] sm:w-[270px] lg:w-[280px] aspect-square rounded-xs overflow-hidden bg-bg-2 border border-border-warm/60 shadow-xs snap-start hover:border-brand-950/40 hover:shadow-md focus-within:ring-2 focus-within:ring-brand-950"
    >
      <motion.a
        href={categoryHref}
        whileHover={hoverGestures.lift}
        whileTap={tapGestures.compress}
        className="block size-full focus:outline-none"
        aria-label={`Explore ${category.name} collection`}
      >
        {/* Category Photography (Square 1:1 Aspect Ratio) */}
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 270px, 280px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Frosted Glass Footer Bar */}
        <div
          data-slot="category-card-footer"
          className="absolute bottom-0 inset-x-0 backdrop-blur-[5px] bg-white/55 px-4 py-2.5 sm:py-3 flex items-center justify-center border-t border-white/20 transition-colors group-hover:bg-white/70"
        >
          <Text
            as="span"
            variant="body-2-semibold"
            weight="bold"
            className="text-sm sm:text-base tracking-[1.5px] uppercase text-grey-900 text-center truncate"
          >
            {category.name}
          </Text>
        </div>
      </motion.a>
    </Card>
  );
};

export default CategoryCard;
