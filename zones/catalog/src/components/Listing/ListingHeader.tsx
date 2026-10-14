import Link from "next/link";
import { Breadcrumb, Heading, Text } from "@timmbr/ui";
import { strings } from "@/app/strings";
import type { Listing } from "@/lib/api/types";
import { SortSelect } from "./SortSelect";

/**
 * Breadcrumb, title and result count, the sort order (desktop; phones have it in the sticky
 * bar) and the subcategories as quick links.
 */
export function ListingHeader({
  listing,
  title,
  showSort = true,
}: {
  listing: Listing;
  title: string;
  /** Hidden for an empty category: there is nothing to sort. */
  showSort?: boolean;
}) {
  const copy = strings.listing;
  const category = listing.category;
  const crumbs = [
    // Home is the shell (another zone): a full page load, not a client-side Link.
    { label: copy.home, href: "/", crossZone: true },
    ...(category
      ? category.breadcrumb.map((c) => ({
          label: c.name,
          href: `/category/${c.slug}`,
        }))
      : [{ label: copy.allProducts }]),
  ];

  return (
    <header className="flex flex-col gap-4">
      <Breadcrumb
        items={crumbs}
        linkComponent={Link}
        ariaLabel={copy.breadcrumb}
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading
            level={1}
            font="display"
            className="text-h3 text-grey-950 lg:text-h2"
          >
            {title}
          </Heading>
          <Text
            as="p"
            variant="body-2"
            className="text-grey-600"
            aria-live="polite"
          >
            {copy.total(listing.total)}
          </Text>
        </div>
        {showSort && <SortSelect className="hidden w-72 lg:flex" />}
      </div>
      {category && category.children.length > 0 && (
        <nav aria-label={category.name}>
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-wrap">
            {category.children.map((child) => (
              <li key={child.slug} className="shrink-0">
                <Link
                  href={`/category/${child.slug}`}
                  className="inline-flex rounded-full border border-grey-300 bg-grey-50 px-4 py-1.5 text-body-3 font-medium text-grey-800 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
