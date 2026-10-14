"use client";

import * as React from "react";
import { Button, FilterDrawer } from "@timmbr/ui";
import { SlidersHorizontal } from "@timmbr/icons";
import { useDebouncedCallback } from "@timmbr/hooks";
import {
  countActiveFilters,
  listingReducer,
  serializeListingSearchParams,
  type ListingAction,
  type ListingState,
} from "@timmbr/utils";
import type { ListingFacets } from "@/lib/api/types";
import { LISTING_CONFIG, formatPrice, toFilterGroups } from "@/lib/listing";
import { filterLabels } from "./FilterSidebar";
import { useListing } from "./ListingProvider";
import { MOBILE_CONTROL_CLASS, SortSelect } from "./SortSelect";

/** Counts for a staged selection. Served by this zone (cached at the edge for 30s). */
const FACETS_ENDPOINT = "/products/api/listing-facets";
const COUNT_DELAY_MS = 250;

/**
 * "Sort · Filter" for phones and tablets, on the page background like the rest of the listing;
 * Filter opens the full-screen drawer. Not sticky: the header already sticks on phones, and a
 * second sticky bar at top-0 would only slide under it.
 */
export function MobileListingBar() {
  const { state } = useListing();
  const [open, setOpen] = React.useState(false);
  // A fresh drawer (and draft) every time it opens.
  const [session, setSession] = React.useState(0);
  const active = countActiveFilters(state);

  return (
    <>
      {/* Same columns and gaps as the product grid below, so the tiles line up with the cards. */}
      <div className="grid grid-cols-2 gap-x-3 sm:gap-x-5 lg:hidden">
        <SortSelect compact className="min-w-0" />
        <Button
          variant="outline"
          className={`w-full min-w-0 hover:bg-grey-50 ${MOBILE_CONTROL_CLASS}`}
          aria-label={filterLabels.open(active)}
          leftIcon={<SlidersHorizontal aria-hidden="true" className="size-4" />}
          onClick={() => {
            setSession((s) => s + 1);
            setOpen(true);
          }}
        >
          {/* One inline row: Button wraps its children in a plain inline span. */}
          <span className="inline-flex items-center gap-2">
            {filterLabels.title}
            {active > 0 && (
              <span
                aria-hidden="true"
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-caption leading-none font-bold text-grey-50"
              >
                {active}
              </span>
            )}
          </span>
        </Button>
      </div>
      {session > 0 && (
        <MobileFilterDrawer key={session} open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}

/**
 * The drawer edits a draft: nothing behind it reloads while the shopper picks. Each change
 * refreshes the counts and "Show N results" (debounced; a newer request cancels the older one),
 * and Apply navigates once with the whole selection. Cancel just closes: the URL never changed.
 */
function MobileFilterDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, listing, navigate } = useListing();
  const [draft, setDraft] = React.useState<ListingState>(state);
  const draftRef = React.useRef(state);
  const [facets, setFacets] = React.useState<ListingFacets>(listing);
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const category = listing.category?.slug;

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const fetchCounts = useDebouncedCallback(async (next: ListingState) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const params = new URLSearchParams(
      serializeListingSearchParams({ ...next, page: 1 }, LISTING_CONFIG),
    );
    if (category) params.set("category", category);
    try {
      const response = await fetch(`${FACETS_ENDPOINT}?${params}`, {
        signal: controller.signal,
      });
      if (response.ok) setFacets((await response.json()) as ListingFacets);
    } catch (error) {
      // Aborted by a newer change, or offline: keep the last counts.
      if (!(error instanceof DOMException && error.name === "AbortError"))
        console.warn(error);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, COUNT_DELAY_MS);

  const update = (action: ListingAction) => {
    const next = listingReducer(draftRef.current, action);
    draftRef.current = next;
    setDraft(next);
    setLoading(true);
    fetchCounts(next);
  };

  const { price } = facets;

  return (
    <FilterDrawer
      open={open}
      onOpenChange={onOpenChange}
      groups={toFilterGroups(facets.facets, draft)}
      onToggle={(key, value) => update({ type: "toggle", key, value })}
      price={
        price.step > 0
          ? {
              min: price.min,
              max: price.max,
              step: price.step,
              value: [draft.priceMin ?? price.min, draft.priceMax ?? price.max],
              format: formatPrice,
            }
          : undefined
      }
      onPriceChange={(min, max) =>
        update({
          type: "setPrice",
          ...(min > price.min && { min }),
          ...(max < price.max && { max }),
        })
      }
      onClearAll={() => update({ type: "clearAll" })}
      onApply={() => {
        fetchCounts.cancel();
        abortRef.current?.abort();
        navigate({ ...draftRef.current, page: 1 });
        onOpenChange(false);
      }}
      total={facets.total}
      loading={loading}
      labels={filterLabels}
    />
  );
}
