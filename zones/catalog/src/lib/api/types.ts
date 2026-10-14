/**
 * timmbr-core response shapes used by the catalog zone (data inside the
 * `{ success, data }` envelope). Mirrors core's DTOs; keep in sync.
 */

/** A node of `GET /categories/tree` (active categories, sorted by name). */
export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  parentId?: string | null;
  children?: CategoryTreeItem[];
}

// ── Listing (GET /catalog/listing, GET /catalog/listing/facets) ─────────────

export type ListingSort =
  "relevance" | "newest" | "price_asc" | "price_desc" | "discount";
export type FilterDisplay = "CHECKBOX" | "SWATCH" | "TOGGLE";

export interface ListingProduct {
  id: string;
  slug: string;
  title: string;
  brandName: string | null;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  discountPct: number;
  hasMultipleVariants: boolean;
  inStock: boolean;
  /** The variant the price is for: what the card's wishlist heart saves. */
  defaultVariantId: string | null;
  coverImage: { url: string; alt: string | null } | null;
}

export interface ListingFacetOption {
  value: string;
  label: string;
  swatchHex?: string | null;
  count: number;
  selected: boolean;
}

export interface ListingFacet {
  key: string;
  label: string;
  displayType: FilterDisplay;
  options: ListingFacetOption[];
  truncated: boolean;
}

/** Slider bounds; `step` is 0 when nothing matches. */
export interface ListingPrice {
  min: number;
  max: number;
  step: number;
  selectedMin?: number;
  selectedMax?: number;
}

/** The request as core understood it: unknown keys/values dropped, canonical order. */
export interface ListingApplied {
  filters: string;
  priceMin?: number;
  priceMax?: number;
  sort: ListingSort;
  q?: string;
}

export interface ListingCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  breadcrumb: { name: string; slug: string }[];
  children: { name: string; slug: string; logoUrl: string | null }[];
}

export interface ListingFacets {
  total: number;
  facets: ListingFacet[];
  price: ListingPrice;
  applied: ListingApplied;
}

export interface Listing extends ListingFacets {
  category: ListingCategory | null;
  products: ListingProduct[];
  page: number;
  limit: number;
  totalPages: number;
}

// ── Product page (GET /catalog/products/:slug) ──────────────────────────────

export type ProductStockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface ProductOptionGroup {
  /** URL key (`finish`). */
  key: string;
  name: string;
  display: "SWATCH" | "PILL";
  options: { value: string; label: string; swatchHex: string | null }[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  discountPct: number;
  currency: string;
  isDefault: boolean;
  /** Value per option group: `{ finish: "walnut" }`. */
  options: Record<string, string>;
  stock: ProductStockStatus;
  /** Units that can be added to a cart now (capped at the per-item limit). */
  available: number;
}

export interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string | null;
  brand: { name: string; slug: string } | null;
  breadcrumb: { name: string; slug: string }[];
  categorySlug: string;
  images: { url: string; alt: string; variantId: string | null }[];
  optionGroups: ProductOptionGroup[];
  variants: ProductVariant[];
  defaultVariantId: string;
  specs: { label: string; value: string }[];
  flags: { fastDelivery: boolean; clearance: boolean };
}

/** "pdp-trust" section of the "catalog" page: promises under Add to cart. */
export interface PdpTrustSection {
  type: "pdp-trust";
  show?: boolean;
  items?: { icon?: string; label: string }[];
  note?: string;
}

/** A saved item (GET /wishlist; only the fields the storefront reads). */
export interface WishlistEntry {
  productId: string;
  variantId: string;
}

/** Core's cart (only the fields the storefront reads). */
export interface CartSummary {
  items: { variantId: string; quantity: number }[];
}

/** GET /catalog/search/suggest: header search typeahead. */
export interface SearchSuggestions {
  products: ListingProduct[];
}

// ── CMS (GET /pages/:slug) ───────────────────────────────────────────────────

/** "plp-banner" section of the "catalog" page: the listing banner. */
export interface PlpBannerSection {
  type: "plp-banner";
  show?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  badges?: { label: string; iconUrl?: string }[];
}

export interface PageResponse {
  slug: string;
  title: string;
  sections: ({ type: string } & Record<string, unknown>)[];
}
