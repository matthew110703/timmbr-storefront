"use client";

import { useCallback, useMemo, useState } from "react";
import { useRecentSearches, useSearchSuggestions } from "@timmbr/hooks";
import type { NavSearchConfig, NavSearchResult } from "@timmbr/ui";
import { formatCurrency } from "@timmbr/utils";
import { strings } from "@/app/strings";

/** Shared by every zone: they're one origin behind the shell, so the list follows the shopper. */
export const RECENT_SEARCHES_KEY = "timmbr:recent-searches:v1";
/** The catalog zone's route proxying core's typeahead (same origin via the shell, edge-cached). */
const SUGGEST_URL = "/products/api/search-suggest";

/** The fields of core's suggestion cards the header shows. */
interface SuggestedProduct {
  id: string;
  slug: string;
  title: string;
  brandName: string | null;
  price: number;
  currency: string;
  coverImage: { url: string; alt: string | null } | null;
}

/** Results page for a query (catalog zone). */
export const searchHref = (query: string) =>
  `/products?${new URLSearchParams({ q: query })}`;

async function fetchSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<SuggestedProduct[]> {
  const response = await fetch(
    `${SUGGEST_URL}?${new URLSearchParams({ q: query })}`,
    { signal },
  );
  if (!response.ok) return [];
  const body = (await response.json()) as { products?: SuggestedProduct[] };
  return body.products ?? [];
}

export function toSearchResult(product: SuggestedProduct): NavSearchResult {
  return {
    id: product.id,
    href: `/products/${product.slug}`,
    // Product pages belong to the catalog zone: full page load.
    crossZone: true,
    title: product.title,
    subtitle: product.brandName ?? undefined,
    price: formatCurrency(product.price, product.currency),
    imageUrl: product.coverImage?.url,
    imageAlt: product.coverImage?.alt ?? "",
  };
}

/**
 * The header search: recent searches (this device), product suggestions while typing, and
 * submit → results page. /products belongs to the catalog zone, so that is a full page load.
 */
export function useHeaderSearch(): NavSearchConfig {
  const [value, setValue] = useState("");
  const recent = useRecentSearches({ storageKey: RECENT_SEARCHES_KEY });
  const suggestions = useSearchSuggestions(value, fetchSuggestions);
  const { add } = recent;
  const copy = strings.header.search;

  const onSubmit = useCallback(
    (query: string) => {
      const q = query.trim();
      if (!q) return;
      add(q);
      window.location.assign(searchHref(q));
    },
    [add],
  );

  const items = useMemo(
    () => suggestions.items.map(toSearchResult),
    [suggestions.items],
  );

  return {
    show: true,
    placeholder: copy.placeholder,
    ariaLabel: copy.ariaLabel,
    value,
    onChange: setValue,
    onSubmit,
    recentSearches: recent.items,
    recentSearchesTitle: copy.recentTitle,
    onRecentSearchRemove: recent.remove,
    onClearRecentSearches: recent.clear,
    clearRecentSearchesLabel: copy.clearRecent,
    removeRecentSearchLabel: copy.removeRecent,
    results: {
      items,
      loading: suggestions.loading,
      title: copy.resultsTitle,
      emptyLabel: copy.noResults,
      viewAllLabel: copy.seeAll,
    },
  };
}
