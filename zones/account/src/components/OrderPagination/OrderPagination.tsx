"use client";

import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@timmbr/ui";
import type { PaginationMeta } from "@timmbr/utils";
import type { OrderFilter } from "@/lib/orders";
import { strings } from "@/app/strings";

const t = strings.orders.pagination;

function pageHref(filter: OrderFilter, page: number) {
  const query = new URLSearchParams();
  if (filter !== "all") query.set("status", filter);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `/orders?${qs}` : "/orders";
}

/** Previous / "Page x of y" / Next. Each page is a URL (next/link, base-path aware). */
export function OrderPagination({
  meta,
  filter,
}: {
  meta: PaginationMeta;
  filter: OrderFilter;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <Pagination aria-label={t.label}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              meta.hasPrevPage ? pageHref(filter, meta.page - 1) : undefined
            }
            disabled={!meta.hasPrevPage}
            linkComponent={Link}
            label={t.previous}
            ariaLabel={t.previous}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationSummary>
            {t.page(meta.page, meta.totalPages)}
          </PaginationSummary>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={
              meta.hasNextPage ? pageHref(filter, meta.page + 1) : undefined
            }
            disabled={!meta.hasNextPage}
            linkComponent={Link}
            label={t.next}
            ariaLabel={t.next}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
