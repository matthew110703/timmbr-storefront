/**
 * CMS Page & Dynamic Section API Types
 */

export interface PageSectionCTA {
  path: string;
  label: string;
}

export interface BaseSectionData {
  type: string;
  show?: boolean;
  title?: string;
  sortOrder?: number;
  [key: string]: unknown;
}

export interface HeroSectionData extends BaseSectionData {
  type: "hero";
  title?: string;
  eyebrow?: string;
  description?: string;
  bannerUrl?: string;
  show?: boolean;
  sortOrder?: number;
  cta?: {
    primary?: PageSectionCTA;
    secondary?: PageSectionCTA;
  };
}

export interface PerkItem {
  label: string;
  iconUrl?: string;
  iconName?: string;
}

export interface DiscountOffer {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  symbol?: string;
  currency?: string;
}

export interface PerksAndOffersSectionData extends BaseSectionData {
  type: "perks-and-offers";
  title?: string;
  show?: boolean;
  sortOrder?: number;
  perks?: PerkItem[];
  discount?: DiscountOffer;
}

export interface AuthBannerSectionData extends BaseSectionData {
  type: "auth-banner";
  title?: string;
  subtitle?: string;
  promoBadge?: string;
  termsNotice?: string;
  imageUrl?: string;
  iconUrl?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  status?: string;
  description?: string | null;
  logoUrl?: string | null;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryConfig {
  source: string;
  limit?: string | number;
  page?: string | number;
  categoryIds?: string;
  productIds?: string;
  [key: string]: unknown;
}

export interface ExploreCategorySectionData extends BaseSectionData {
  type: "explore-category";
  title?: string;
  show?: boolean;
  sortOrder?: number;
  isDynamic?: boolean | string;
  queryConfig?: QueryConfig;
  categories?: CategoryItem[];
}

export interface ProductCoverImage {
  id?: string;
  url: string;
  altText?: string | null;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  status?: string;
  hsnCode?: string | null;
  gstRate?: number;
  brandId?: string | null;
  categoryId?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  hasMultipleVariants?: boolean;
  coverImage?: ProductCoverImage | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FeaturedBanner {
  title: string;
  imageUrl: string;
  cta?: {
    primary?: PageSectionCTA;
    secondary?: PageSectionCTA;
  };
  [key: string]: unknown;
}

export interface TrendingSectionData extends BaseSectionData {
  type: "trending";
  title?: string;
  show?: boolean;
  sortOrder?: number;
  description?: string;
  isDynamic?: boolean | string;
  queryConfig?: QueryConfig;
  featuredBanners?: FeaturedBanner[];
  products?: ProductItem[];
}

export interface ConsultationSectionData extends BaseSectionData {
  type: "consultation";
  title?: string;
  show?: boolean;
  sortOrder?: number;
  eyebrow?: string;
  description?: string;
  bannerUrl?: string;
  cta?: {
    primary?: PageSectionCTA;
    secondary?: PageSectionCTA;
  };
}

/**
 * Flexible Page Section type allowing dynamic section types while providing
 * strong typing for known section models.
 */
export type PageSection =
  | HeroSectionData
  | PerksAndOffersSectionData
  | ExploreCategorySectionData
  | TrendingSectionData
  | ConsultationSectionData
  | AuthBannerSectionData
  | BaseSectionData;

export interface PageResponse {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Type guard for Hero Section Data
 */
export function isHeroSection(
  section: PageSection,
): section is HeroSectionData {
  return section.type === "hero";
}

/**
 * Type guard for Perks and Offers Section Data
 */
export function isPerksAndOffersSection(
  section: PageSection,
): section is PerksAndOffersSectionData {
  return section.type === "perks-and-offers";
}

/**
 * Type guard for Explore Category Section Data
 */
export function isExploreCategorySection(
  section: PageSection,
): section is ExploreCategorySectionData {
  return section.type === "explore-category";
}

/**
 * Type guard for Trending Section Data
 */
export function isTrendingSection(
  section: PageSection,
): section is TrendingSectionData {
  return section.type === "trending";
}

/**
 * Type guard for Consultation Section Data
 */
export function isConsultationSection(
  section: PageSection,
): section is ConsultationSectionData {
  return section.type === "consultation";
}

/**
 * Type guard for Auth Modal Banner Section Data
 */
export function isAuthBannerSection(
  section: PageSection,
): section is AuthBannerSectionData {
  return section.type === "auth-banner";
}
