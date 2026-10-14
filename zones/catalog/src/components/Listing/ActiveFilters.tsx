"use client";

import { FilterChips } from "@timmbr/ui";
import { listingReducer } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { activeChips } from "@/lib/listing";
import { useListing } from "./ListingProvider";

/** The search and the applied filters as removable chips, above the results. */
export function ActiveFilters({ className }: { className?: string }) {
  const { state, listing, dispatch } = useListing();
  const copy = strings.listing.filters;

  return (
    <FilterChips
      className={className}
      chips={activeChips(state, listing.facets)}
      onRemove={(chip) => dispatch(chip.action)}
      // Every chip goes, the search included (the sidebar's "Clear all" keeps the search).
      onClearAll={() =>
        dispatch({
          type: "replace",
          state: listingReducer(listingReducer(state, { type: "clearAll" }), {
            type: "setQuery",
          }),
        })
      }
      clearAllLabel={copy.clearAll}
      removeLabel={copy.removeChip}
    />
  );
}
