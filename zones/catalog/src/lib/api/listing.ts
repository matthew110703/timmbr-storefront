import { cache } from "react";
import { isApiError } from "@timmbr/utils";
import { api } from "./client";
import type { Listing, ListingFacets, SearchSuggestions } from "./types";

/** Query parameters of core's listing endpoints (already normalised by the zone). */
export interface ListingQuery {
  category?: string;
  filters?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
  q?: string;
}

/** `not-found` for an unknown category; everything else either works or throws. */
export type ListingResult =
  { status: "ok"; listing: Listing } | { status: "not-found" };

const toParams = (query: ListingQuery) => ({
  category: query.category,
  filters: query.filters || undefined,
  priceMin: query.priceMin,
  priceMax: query.priceMax,
  sort: query.sort,
  page: query.page && query.page > 1 ? query.page : undefined,
  q: query.q,
});

/**
 * One listing page: products, facet counts, price bounds and the category context.
 * `no-store`: core already caches each normalised request in Redis, so a per-URL copy in the
 * Next data cache would only add a second, separately-expiring layer. React `cache` dedupes the
 * call between `generateMetadata` and the page (the key is the serialised query).
 */
const fetchListing = cache(async (key: string): Promise<ListingResult> => {
  const query = JSON.parse(key) as ListingQuery;
  try {
    const listing = await api.get<Listing>("/catalog/listing", {
      params: toParams(query),
      skipAuth: true,
      cache: "no-store",
    });
    return { status: "ok", listing };
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404)
      return { status: "not-found" };
    throw error;
  }
});

export function getListing(query: ListingQuery): Promise<ListingResult> {
  return fetchListing(JSON.stringify(toParams(query)));
}

/** Counts only, for the mobile filter drawer (through this zone's facets route). */
export function getListingFacets(query: ListingQuery): Promise<ListingFacets> {
  return api.get<ListingFacets>("/catalog/listing/facets", {
    params: toParams(query),
    skipAuth: true,
    cache: "no-store",
  });
}

/** Header search typeahead: the top few products matching every word of `q`. */
export function getSearchSuggestions(q: string): Promise<SearchSuggestions> {
  return api.get<SearchSuggestions>("/catalog/search/suggest", {
    params: { q },
    skipAuth: true,
    cache: "no-store",
  });
}
