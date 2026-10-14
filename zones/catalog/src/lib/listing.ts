import {
  decodeFilters,
  encodeFilters,
  parseListingSearchParams,
  serializeListingSearchParams,
  type ListingAction,
  type ListingState,
} from "@timmbr/utils";
import type { FilterChip, FilterGroup, FilterGroupDisplay } from "@timmbr/ui";
import type { ListingQuery } from "./api/listing";
import type { Listing, ListingFacet, ListingSort } from "./api/types";

/**
 * Listing URL ↔ core request mapping for the catalog zone. The query string is the state:
 *   /category/sofas?material=teak,walnut&price=10000-50000&sort=price_asc&page=2
 * The generic parse/serialize/reducer live in @timmbr/utils; this file only knows core's
 * parameter names and response shape.
 */

export const LISTING_SORTS: readonly ListingSort[] = [
  "relevance",
  "newest",
  "price_asc",
  "price_desc",
  "discount",
];
export const DEFAULT_SORT: ListingSort = "relevance";
/** `category` is the facets route's own parameter (core reserves the same key), never a filter. */
export const LISTING_CONFIG = {
  sorts: LISTING_SORTS,
  defaultSort: DEFAULT_SORT,
  reserved: ["category"],
} as const;

export type SearchParams = Record<string, string | string[] | undefined>;

export function parseListingUrl(
  params: SearchParams | URLSearchParams | string,
): ListingState {
  return parseListingSearchParams(params, LISTING_CONFIG);
}

/** The core request for a listing state (filters travel as one `filters` parameter). */
export function toListingQuery(
  state: ListingState,
  category?: string,
): ListingQuery {
  return {
    category,
    filters: encodeFilters(state.filters),
    priceMin: state.priceMin,
    priceMax: state.priceMax,
    sort: state.sort,
    page: state.page,
    q: state.q,
  };
}

/**
 * The state as core applied it (unknown keys and values dropped). Pages render from this, so
 * the canonical URL, the chips and the panel never show a filter core ignored.
 */
export function stateFromListing(listing: Listing): ListingState {
  const { applied } = listing;
  return {
    filters: decodeFilters(applied.filters),
    ...(applied.priceMin !== undefined && { priceMin: applied.priceMin }),
    ...(applied.priceMax !== undefined && { priceMax: applied.priceMax }),
    ...(applied.q && { q: applied.q }),
    ...(applied.sort !== DEFAULT_SORT && { sort: applied.sort }),
    page: listing.page,
  };
}

/** URL of a listing state under a base path ("/products" or "/category/<slug>"). */
export function listingHref(basePath: string, state: ListingState): string {
  const query = serializeListingSearchParams(state, LISTING_CONFIG);
  return query ? `${basePath}?${query}` : basePath;
}

/** Whether the state narrows the results (filters, price or search): such pages aren't indexed. */
export function isNarrowed(state: ListingState): boolean {
  return (
    Object.keys(state.filters).length > 0 ||
    state.priceMin !== undefined ||
    state.priceMax !== undefined ||
    !!state.q
  );
}

const DISPLAY: Record<ListingFacet["displayType"], FilterGroupDisplay> = {
  CHECKBOX: "checkbox",
  SWATCH: "swatch",
  TOGGLE: "toggle",
};

/** Core facets → FilterPanel groups, with the selection taken from `state` (it may be a draft). */
export function toFilterGroups(
  facets: ListingFacet[],
  state: ListingState,
): FilterGroup[] {
  return facets.map((facet) => {
    const selected = new Set(state.filters[facet.key] ?? []);
    return {
      key: facet.key,
      label: facet.label,
      display: DISPLAY[facet.displayType],
      options: facet.options.map((option) => ({
        value: option.value,
        label: option.label,
        count: option.count,
        selected: selected.has(option.value),
        swatch: option.swatchHex ?? null,
      })),
    };
  });
}

export const formatPrice = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

export interface ListingChip extends FilterChip {
  action: ListingAction;
}

/** Id of the search chip in activeChips. */
export const SEARCH_CHIP_ID = "q";

/**
 * Everything narrowing the results, as removable chips: the search first, then one chip per
 * selected value (toggles show their group name), then the price range.
 */
export function activeChips(
  state: ListingState,
  facets: ListingFacet[],
): ListingChip[] {
  const chips: ListingChip[] = [];
  if (state.q) {
    chips.push({
      id: SEARCH_CHIP_ID,
      label: `“${state.q}”`,
      action: { type: "setQuery" },
    });
  }
  for (const [key, values] of Object.entries(state.filters)) {
    const facet = facets.find((f) => f.key === key);
    for (const value of values) {
      const option = facet?.options.find((o) => o.value === value);
      chips.push({
        id: `${key}:${value}`,
        label:
          facet?.displayType === "TOGGLE"
            ? facet.label
            : (option?.label ?? value),
        action: { type: "toggle", key, value },
      });
    }
  }
  if (state.priceMin !== undefined || state.priceMax !== undefined) {
    const from =
      state.priceMin !== undefined ? formatPrice(state.priceMin) : "";
    const to = state.priceMax !== undefined ? formatPrice(state.priceMax) : "";
    chips.push({
      id: "price",
      label: from && to ? `${from} – ${to}` : from ? `${from}+` : `Up to ${to}`,
      action: { type: "clearPrice" },
    });
  }
  return chips;
}
