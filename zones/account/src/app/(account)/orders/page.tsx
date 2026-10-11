import type { Metadata } from "next";
import { EmptyState, Icon, LinkButton, PageHeader, Stack } from "@timmbr/ui";
import { Package } from "@timmbr/icons";
import { OrderCard } from "@/components/OrderCard";
import { OrderFilters } from "@/components/OrderFilters";
import { OrderPagination } from "@/components/OrderPagination";
import { listOrders } from "@/lib/api/account";
import { ORDER_FILTERS, parseOrderFilter } from "@/lib/orders";
import { strings } from "@/app/strings";

export const metadata: Metadata = { title: `${strings.orders.title} | timmbr` };

const t = strings.orders;

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string | string[];
    page?: string | string[];
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const query = await searchParams;
  const filter = parseOrderFilter(query.status);
  const page = Math.max(
    1,
    Number(Array.isArray(query.page) ? query.page[0] : query.page) || 1,
  );

  const { data: orders, meta } = await listOrders({
    status: [...ORDER_FILTERS[filter]],
    page,
  });

  return (
    <Stack gap={6}>
      <PageHeader as="h2" title={t.title} description={t.description} />
      <OrderFilters active={filter} />

      {orders.length === 0 ? (
        <EmptyState
          variant="bordered"
          fullWidth
          icon={
            <Icon size="lg" foreground="primary">
              <Package />
            </Icon>
          }
          title={t.empty.title}
          description={filter === "all" ? t.empty.all : t.empty.filtered}
          action={
            filter === "all" ? (
              <LinkButton href="/products" crossZone variant="primary">
                {t.empty.cta}
              </LinkButton>
            ) : undefined
          }
        />
      ) : (
        <Stack asChild gap={4}>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ul>
        </Stack>
      )}

      <OrderPagination meta={meta} filter={filter} />
    </Stack>
  );
}
