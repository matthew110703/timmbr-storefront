import Link from "next/link";
import { Heading, LinkButton, Text } from "@timmbr/ui";
import { X } from "@timmbr/icons";
import { listingReducer, type ListingState } from "@timmbr/utils";
import { PackageSearch, SearchX } from "lucide-react";
import { strings } from "@/app/strings";
import type { Listing } from "@/lib/api/types";
import {
  SEARCH_CHIP_ID,
  activeChips,
  isNarrowed,
  listingHref,
  type ListingChip,
} from "@/lib/listing";

function EmptyCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-sm bg-grey-50 px-6 py-14 text-center shadow-md sm:px-12">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-7"
      >
        {icon}
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <Heading level={2} font="display" className="text-h4 text-grey-950">
          {title}
        </Heading>
        <Text as="p" variant="body-2" className="text-grey-600">
          {description}
        </Text>
      </div>
      {children}
    </section>
  );
}

/** Each chip as a link to the listing without it. */
function RemovableChips({
  chips,
  state,
  basePath,
}: {
  chips: ListingChip[];
  state: ListingState;
  basePath: string;
}) {
  const copy = strings.listing.empty;
  return (
    <ul
      className="flex flex-wrap justify-center gap-2"
      aria-label={copy.activeFilters}
    >
      {chips.map((chip) => (
        <li key={chip.id}>
          <Link
            href={listingHref(basePath, listingReducer(state, chip.action))}
            aria-label={copy.removeFilter(String(chip.label))}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 text-body-3 font-medium text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {chip.label}
            <X aria-hidden="true" className="size-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * No results, in three shapes:
 * - a search matched nothing: tips, plus removable filters if any narrowed it further;
 * - filters matched nothing: every active filter as a one-tap removal, plus "Clear all"
 *   (the sidebar stays, so shoppers can also adjust from there);
 * - the category itself is empty: point to its parent category and to the whole catalog.
 */
export function EmptyListing({
  listing,
  state,
  basePath,
}: {
  listing: Listing;
  state: ListingState;
  basePath: string;
}) {
  const copy = strings.listing.empty;
  const chips = activeChips(state, listing.facets);

  if (state.q) {
    const filterChips = chips.filter((chip) => chip.id !== SEARCH_CHIP_ID);
    const withoutSearch = listingReducer(state, { type: "setQuery" });
    return (
      <EmptyCard
        icon={<SearchX />}
        title={copy.noSearchResults(state.q)}
        description={
          filterChips.length ? copy.searchWithFilters : copy.searchTips
        }
      >
        {filterChips.length > 0 && (
          <RemovableChips
            chips={filterChips}
            state={state}
            basePath={basePath}
          />
        )}
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {filterChips.length > 0 && (
            <LinkButton
              variant="primary"
              href={listingHref(
                basePath,
                listingReducer(state, { type: "clearAll" }),
              )}
            >
              {copy.clearAll}
            </LinkButton>
          )}
          <LinkButton
            variant={filterChips.length ? "outline" : "primary"}
            href={listingHref(basePath, withoutSearch)}
          >
            {basePath === "/products" && !filterChips.length
              ? copy.browseAll
              : copy.clearSearch}
          </LinkButton>
        </div>
      </EmptyCard>
    );
  }

  if (!isNarrowed(state) || chips.length === 0) {
    const trail = listing.category?.breadcrumb ?? [];
    const parent = trail.length > 1 ? trail[trail.length - 2] : null;
    return (
      <EmptyCard
        icon={<PackageSearch />}
        title={copy.emptyCategory}
        description={copy.emptyCategoryDescription(listing.category?.name)}
      >
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {parent && (
            <LinkButton variant="primary" href={`/category/${parent.slug}`}>
              {copy.exploreParent(parent.name)}
            </LinkButton>
          )}
          <LinkButton variant={parent ? "outline" : "primary"} href="/products">
            {copy.browseAll}
          </LinkButton>
        </div>
      </EmptyCard>
    );
  }

  return (
    <EmptyCard
      icon={<SearchX />}
      title={copy.title}
      description={copy.description}
    >
      <RemovableChips chips={chips} state={state} basePath={basePath} />
      <LinkButton
        variant="primary"
        className="mt-2"
        href={listingHref(
          basePath,
          listingReducer(state, { type: "clearAll" }),
        )}
      >
        {copy.clearAll}
      </LinkButton>
    </EmptyCard>
  );
}
