"use client";

import { FilterPanel } from "@timmbr/ui";
import { countActiveFilters } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { formatPrice, listingHref, toFilterGroups } from "@/lib/listing";
import { useListing } from "./ListingProvider";

/** Filter labels shared by the sidebar and the mobile drawer. */
export const filterLabels = strings.listing.filters;

/**
 * Desktop filter sidebar (Figma PLP). Ticks apply live: the box checks at once and the change
 * navigates after a short pause, so several quick ticks load one page. The price applies on
 * its Apply button, so dragging the slider sends nothing.
 */
export function FilterSidebar({ className }: { className?: string }) {
  const { state, applied, basePath, listing, dispatch } = useListing();
  const { price } = listing;

  return (
    <FilterPanel
      className={className}
      groups={toFilterGroups(listing.facets, state)}
      onToggle={(key, value) =>
        dispatch({ type: "toggle", key, value }, { debounce: true })
      }
      onClearGroup={(key) => dispatch({ type: "clearGroup", key })}
      price={
        price.step > 0
          ? {
              min: price.min,
              max: price.max,
              step: price.step,
              value: [state.priceMin ?? price.min, state.priceMax ?? price.max],
              format: formatPrice,
              onApply: (min, max) =>
                dispatch(
                  min <= price.min && max >= price.max
                    ? { type: "clearPrice" }
                    : {
                        type: "setPrice",
                        ...(min > price.min && { min }),
                        ...(max < price.max && { max }),
                      },
                ),
              onReset: () => dispatch({ type: "clearPrice" }),
              // Any applied change (Clear all, a chip, back/forward) drops an un-applied drag.
              resetKey: listingHref(basePath, applied),
            }
          : undefined
      }
      labels={filterLabels}
      headerAction={
        countActiveFilters(state) > 0 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "clearAll" })}
            className="rounded-sm text-body-3 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {filterLabels.clearAll}
          </button>
        ) : undefined
      }
    />
  );
}
