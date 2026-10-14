"use client";

import { Select } from "@timmbr/ui";
import { cn } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { DEFAULT_SORT, LISTING_SORTS } from "@/lib/listing";
import { useListing } from "./ListingProvider";

/**
 * The phone controls (sort and Filter): white tiles on the cream page with the warm hairline
 * border used across the storefront (header search, cards), one height and weight for both,
 * content centred (the sort label and its arrow sit together, like the Filter icon and label).
 */
export const MOBILE_CONTROL_CLASS =
  "h-11 justify-center gap-2 rounded-sm border border-border-warm bg-grey-50 px-3.5 text-body-2 font-semibold text-grey-900 shadow-xs transition-colors hover:border-grey-400 [&_svg]:text-grey-700";

const OPTIONS = LISTING_SORTS.map((sort) => ({
  value: sort,
  label: strings.listing.sorts[sort],
}));

/**
 * Sort order; changing it returns to page 1. Sits on the page background like the other page
 * controls (transparent, hairline border, 4px radius) rather than as a white form field.
 */
export function SortSelect({
  className,
  compact = false,
}: {
  className?: string;
  /** Phones: no visible label, styled like the Filter button. */
  compact?: boolean;
}) {
  const { state, dispatch } = useListing();
  const copy = strings.listing;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact && (
        <span aria-hidden="true" className="shrink-0 text-body-3 text-grey-600">
          {copy.sortBy}
        </span>
      )}
      <Select
        ariaLabel={copy.sortBy}
        options={OPTIONS}
        size={compact ? "default" : "sm"}
        value={state.sort ?? DEFAULT_SORT}
        onValueChange={(sort) => dispatch({ type: "setSort", sort })}
        className={
          compact
            ? MOBILE_CONTROL_CLASS
            : "rounded-sm border-grey-300 bg-transparent font-medium transition-colors hover:border-grey-500"
        }
        containerClassName="min-w-0 flex-1"
      />
    </div>
  );
}
