import * as React from "react";
import { Heading, Stack, ScrollRail } from "@timmbr/ui";
import type { ExploreCategorySectionData, CategoryItem } from "@/lib/api/types";
import { strings } from "@/app/strings";
import { MOCK_FALLBACK_CATEGORIES } from "@/app/mock";
import { CategoryCard } from "./CategoryCard";

export interface ExploreCategoriesProps {
  section?: ExploreCategorySectionData | null;
  categories?: CategoryItem[];
  title?: string;
  className?: string;
}

/**
 * Explore Categories Section (Server Component).
 * Implements the horizontal scroll category showcase from Figma (node-id=82-375)
 * strictly composed with @timmbr/ui typography/layout primitives and modular client leaf CategoryCard.
 */
export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  section,
  categories,
  title: titleProp,
  className,
}) => {
  const title = titleProp || section?.title || strings.exploreCategories.title;

  const displayCategories: readonly CategoryItem[] =
    categories && categories.length > 0 ? categories : MOCK_FALLBACK_CATEGORIES;

  return (
    <section
      aria-label={title}
      data-slot="shell-explore-categories"
      className={`w-full ${className ?? ""}`}
    >
      <Stack gap={6} className="w-full">
        {/* Section Heading */}
        <Heading
          level={2}
          font="display"
          foreground="secondary"
          className="text-2xl sm:text-3xl lg:text-[32px] text-center tracking-tight leading-[1.3]"
        >
          {title}
        </Heading>

        {/* Horizontal Scroll Track */}
        <ScrollRail gap="md">
          {displayCategories.map((category: CategoryItem) => (
            <CategoryCard
              key={category.id || category.slug}
              category={category}
            />
          ))}
        </ScrollRail>
      </Stack>
    </section>
  );
};

export default ExploreCategories;
