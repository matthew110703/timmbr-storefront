import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { strings } from "@/app/strings";
import { getListing } from "@/lib/api/listing";
import type { Listing } from "@/lib/api/types";
import {
  isNarrowed,
  listingHref,
  parseListingUrl,
  stateFromListing,
  toListingQuery,
  type SearchParams,
} from "@/lib/listing";
import { ActiveFilters } from "./ActiveFilters";
import { EmptyListing } from "./EmptyListing";
import { FilterSidebar } from "./FilterSidebar";
import { ListingBanner, ListingBannerSkeleton } from "./ListingBanner";
import { ListingHeader } from "./ListingHeader";
import { ListingPagination } from "./ListingPagination";
import { ListingProvider, ListingResults } from "./ListingProvider";
import { MobileListingBar } from "./MobileFilters";
import { ProductGrid } from "./ProductGrid";

export interface ListingPageProps {
  /** "/products" or "/category/<slug>". */
  basePath: string;
  /** Category slug; omitted for all products. */
  category?: string;
  searchParams: SearchParams;
}

/**
 * Loads a listing for the URL, or 404s: unknown category, or a page past the last one.
 * Shared by the page and its metadata; the request is deduped (React `cache`).
 */
async function loadListing({
  category,
  searchParams,
}: ListingPageProps): Promise<Listing> {
  const requested = parseListingUrl(searchParams);
  const result = await getListing(toListingQuery(requested, category));
  if (result.status === "not-found") notFound();
  const { listing } = result;
  if (listing.total > 0 && listing.page > listing.totalPages) notFound();
  return listing;
}

function titleOf(listing: Listing): string {
  const copy = strings.listing;
  if (listing.category) return listing.category.name;
  return listing.applied.q
    ? copy.searchTitle(listing.applied.q)
    : copy.allProducts;
}

/**
 * SEO: the canonical URL is the clean listing (plus `page` past the first), so filtered,
 * sorted and searched variants consolidate into it; narrowed pages aren't indexed but their
 * links are followed.
 */
export async function listingMetadata(
  props: ListingPageProps,
): Promise<Metadata> {
  const listing = await loadListing(props);
  const state = stateFromListing(listing);
  const title = titleOf(listing);
  const canonical = listingHref(props.basePath, {
    filters: {},
    page: state.page,
  });
  return {
    title: `${title} | timmbr`,
    description:
      listing.category?.description ??
      `Shop ${title.toLowerCase()} in solid wood, handcrafted to last. ${strings.listing.total(listing.total)}.`,
    alternates: { canonical },
    robots:
      isNarrowed(state) || state.sort
        ? { index: false, follow: true }
        : undefined,
  };
}

/**
 * A listing page (Figma PLP): CMS banner, breadcrumb and title, filters (sidebar on desktop,
 * drawer on phones), the product grid and pagination. Server-rendered from one core request;
 * only the controls hydrate.
 */
export async function ListingPage(props: ListingPageProps) {
  const listing = await loadListing(props);
  const state = stateFromListing(listing);
  const title = titleOf(listing);
  const { basePath } = props;
  // Nothing to filter: an empty category, or a search with no matches (and no filters). The
  // empty state then takes the full width, without the sidebar, sort or chips.
  const nothingToFilter =
    listing.total === 0 && !isNarrowed({ ...state, q: undefined });

  const breadcrumbJsonLd = listing.category && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listing.category.breadcrumb.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `/category/${crumb.slug}`,
    })),
  };

  return (
    <ListingProvider listing={listing} applied={state} basePath={basePath}>
      <div className="flex flex-col gap-6 py-6 lg:gap-8 lg:py-8">
        <Suspense fallback={<ListingBannerSkeleton />}>
          <ListingBanner />
        </Suspense>
        <ListingHeader
          listing={listing}
          title={title}
          showSort={!nothingToFilter}
        />
        {!nothingToFilter && <MobileListingBar />}
        <div
          className={
            nothingToFilter
              ? "grid"
              : "grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]"
          }
        >
          {/* Nothing to narrow: no filters, full-width message. */}
          {!nothingToFilter && (
            <aside className="hidden lg:block">
              {/* Stays in view below the sticky header and scrolls on its own (capped to the
                  viewport), so the wheel over the filters moves the filters, not the page. */}
              <FilterSidebar className="sticky top-[5.5rem] max-h-[calc(100dvh-6.5rem)]" />
            </aside>
          )}
          <ListingResults id="listing-results">
            {!nothingToFilter && <ActiveFilters className="mb-5" />}
            {listing.products.length > 0 ? (
              <ProductGrid products={listing.products} />
            ) : (
              <EmptyListing
                listing={listing}
                state={state}
                basePath={basePath}
              />
            )}
            <ListingPagination
              state={state}
              basePath={basePath}
              page={listing.page}
              totalPages={listing.totalPages}
              total={listing.total}
              limit={listing.limit}
            />
          </ListingResults>
        </div>
      </div>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          // JSON.stringify output is safe here: no user-controlled HTML.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </ListingProvider>
  );
}
