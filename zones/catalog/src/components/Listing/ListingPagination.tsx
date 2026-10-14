"use client";

import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@timmbr/ui";
import type { ListingState } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { listingHref } from "@/lib/listing";

/** Page numbers to show: first, last, and a window around the current page; null = "…". */
export function pageWindow(
  current: number,
  total: number,
  around = 1,
): (number | null)[] {
  const pages = new Set([1, total]);
  for (let p = current - around; p <= current + around; p++)
    if (p >= 1 && p <= total) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1)
      out.push(page - sorted[i - 1] === 2 ? page - 1 : null);
    out.push(page);
  });
  return out;
}

/**
 * Numbered pagination: real links (crawlable, prefetched, back/forward friendly), which keep
 * the filters and sort and change only `page`.
 */
export function ListingPagination({
  state,
  basePath,
  page,
  totalPages,
  total,
  limit,
}: {
  state: ListingState;
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}) {
  if (totalPages <= 1) return null;
  const copy = strings.listing.pagination;
  const href = (p: number) => listingHref(basePath, { ...state, page: p });
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <Pagination aria-label={copy.label}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page > 1 ? href(page - 1) : undefined}
              linkComponent={Link}
              label={copy.previous}
              disabled={page <= 1}
            />
          </PaginationItem>
          {pageWindow(page, totalPages).map((p, i) =>
            p === null ? (
              <PaginationItem key={`gap-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink asChild isActive={p === page}>
                  <Link
                    href={href(p)}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </Link>
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href={page < totalPages ? href(page + 1) : undefined}
              linkComponent={Link}
              label={copy.next}
              disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <PaginationSummary>{copy.summary(from, to, total)}</PaginationSummary>
    </div>
  );
}
