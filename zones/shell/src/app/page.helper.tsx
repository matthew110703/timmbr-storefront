import * as React from "react";
import { Hero } from "@/components/Hero";
import { PerksAndOffers } from "@/components/PerksAndOffers";
import { ExploreCategories } from "@/components/ExploreCategories";
import { Trending } from "@/components/Trending";
import { Consultation } from "@/components/Consultation";
import {
  getPageBySlug,
  getCategories,
  getProducts,
  isExploreCategorySection,
  isTrendingSection,
  type CategoryItem,
  type ProductItem,
  type PageSection,
  type HeroSectionData,
  type PerksAndOffersSectionData,
  type ExploreCategorySectionData,
  type TrendingSectionData,
  type ConsultationSectionData,
} from "@/lib/api";

interface ResolvedSectionData {
  categories: CategoryItem[];
  trendingProducts: ProductItem[];
}

/**
 * Pre-fetches dynamic data dependencies for landing sections in parallel.
 */
async function fetchSectionDependencies(
  sections: PageSection[],
): Promise<ResolvedSectionData> {
  const exploreCategorySection = sections.find(isExploreCategorySection);
  const trendingSection = sections.find(isTrendingSection);

  const categoriesPromise: Promise<CategoryItem[]> = (() => {
    if (
      exploreCategorySection?.isDynamic === "true" ||
      exploreCategorySection?.isDynamic === true
    ) {
      if (exploreCategorySection.queryConfig?.source === "category") {
        const limit =
          typeof exploreCategorySection.queryConfig.limit === "number"
            ? exploreCategorySection.queryConfig.limit
            : exploreCategorySection.queryConfig.limit
              ? parseInt(String(exploreCategorySection.queryConfig.limit), 10)
              : undefined;
        const categoryIds = exploreCategorySection.queryConfig.categoryIds as
          string | undefined;

        return getCategories({ limit, categoryIds });
      }
    } else if (
      exploreCategorySection?.categories &&
      exploreCategorySection.categories.length > 0
    ) {
      return Promise.resolve(exploreCategorySection.categories);
    }
    return Promise.resolve([]);
  })();

  const trendingProductsPromise: Promise<ProductItem[]> = (() => {
    if (
      trendingSection?.isDynamic === "true" ||
      trendingSection?.isDynamic === true
    ) {
      if (trendingSection.queryConfig?.source === "products") {
        const productIds = trendingSection.queryConfig.productIds as
          string | undefined;
        const limit =
          typeof trendingSection.queryConfig.limit === "number"
            ? trendingSection.queryConfig.limit
            : trendingSection.queryConfig.limit
              ? parseInt(String(trendingSection.queryConfig.limit), 10)
              : undefined;

        return getProducts({ productIds, limit });
      }
    } else if (
      trendingSection?.products &&
      trendingSection.products.length > 0
    ) {
      return Promise.resolve(trendingSection.products);
    }
    return Promise.resolve([]);
  })();

  const [categories, trendingProducts] = await Promise.all([
    categoriesPromise,
    trendingProductsPromise,
  ]);

  return { categories, trendingProducts };
}

/**
 * Renders an individual section using a clean switch statement.
 */
export function renderLandingSection(
  section: PageSection,
  data: ResolvedSectionData,
  index: number,
): React.ReactNode {
  const key = `${section.type}-${section.sortOrder ?? index}`;

  switch (section.type) {
    case "hero":
      return (
        <Hero
          key={key}
          data={section as HeroSectionData}
          title={section.title}
        />
      );

    case "perks-and-offers":
      return (
        <PerksAndOffers
          key={key}
          data={section as PerksAndOffersSectionData}
          title={section.title}
        />
      );

    case "explore-category":
      return (
        <ExploreCategories
          key={key}
          section={section as ExploreCategorySectionData}
          categories={data.categories}
          title={section.title}
        />
      );

    case "trending":
      return (
        <Trending
          key={key}
          section={section as TrendingSectionData}
          products={data.trendingProducts}
          title={section.title}
        />
      );

    case "consultation":
      return (
        <Consultation
          key={key}
          data={section as ConsultationSectionData}
          title={section.title}
        />
      );

    default:
      return null;
  }
}

/**
 * Orchestrates fetching CMS landing page metadata, sorting sections, resolving data,
 * and mapping active sections to their respective component trees.
 */
export async function resolveLandingSections(): Promise<React.ReactNode[]> {
  const pageData = await getPageBySlug("landing-page");
  const rawSections: PageSection[] = pageData?.sections ?? [];

  // 1. Filter active sections (honor show !== false)
  const activeSections = rawSections.filter(
    (section) => section.show !== false,
  );

  // 2. Sort sections by sortOrder ascending
  const sortedSections = [...activeSections].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  // 3. Resolve dynamic API data dependencies concurrently
  const dynamicData = await fetchSectionDependencies(sortedSections);

  // 4. Map sections using switch-based renderer
  return sortedSections.map((section, index) =>
    renderLandingSection(section, dynamicData, index),
  );
}
