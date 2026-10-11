"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@timmbr/ui";
import { ORDER_FILTERS, type OrderFilter } from "@/lib/orders";
import { strings } from "@/app/strings";

const FILTERS = Object.keys(ORDER_FILTERS) as OrderFilter[];

export const orderFilterHref = (filter: OrderFilter) =>
  filter === "all" ? "/orders" : `/orders?status=${filter}`;

/**
 * Status tabs. Each filter is a URL (`?status=`), so it can be shared and
 * survives a reload; the tab switches immediately while the list loads.
 */
export function OrderFilters({ active }: { active: OrderFilter }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useOptimistic(active);

  const select = (value: string) => {
    const filter = value as OrderFilter;
    startTransition(() => {
      setSelected(filter);
      router.push(orderFilterHref(filter), { scroll: false });
    });
  };

  return (
    <Tabs
      value={selected}
      onValueChange={select}
      // Arrow keys move focus; Enter / Space opens the filter (one request per choice).
      activationMode="manual"
      variant="underline"
      aria-label={strings.orders.filtersLabel}
    >
      <TabsList
        scrollable
        scrollLabels={strings.orders.filtersScroll}
        loading={pending}
      >
        {FILTERS.map((filter) => (
          <TabsTrigger key={filter} value={filter}>
            {strings.orders.filters[filter]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
