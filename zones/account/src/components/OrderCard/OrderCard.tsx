import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  Icon,
  LinkButton,
  Price,
  Stack,
  Text,
} from "@timmbr/ui";
import { ArrowRight } from "@timmbr/icons";
import { formatDate } from "@timmbr/utils";
import { OrderLineItem } from "@/components/OrderLineItem";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { orderNumber } from "@/lib/orders";
import { strings } from "@/app/strings";
import type { Order } from "@/lib/api/types";

/** How many products the list card shows before "+ N more". */
const PREVIEW_ITEMS = 2;

const t = strings.orders;

/** An order in the list: number, status, key facts and the first items. */
export function OrderCard({ order }: { order: Order }) {
  const placed = order.placedAt ?? order.createdAt;
  const address = order.shippingAddress;
  const shipTo = address
    ? [
        `${address.firstName ?? ""} ${address.lastName ?? ""}`.trim(),
        address.city,
      ]
        .filter(Boolean)
        .join(", ")
    : null;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const hidden = order.items.length - PREVIEW_ITEMS;
  const titleId = `order-${order.id}`;

  return (
    <Card asChild sectioned padding="sm">
      <article aria-labelledby={titleId}>
        <CardHeader
          divider
          actions={<OrderStatusBadge status={order.status} />}
        >
          <CardTitle asChild>
            <h2 id={titleId}>{t.number(orderNumber(order.id))}</h2>
          </CardTitle>
          <CardDescription>
            {t.placedOn(formatDate(placed, "dateTime"))} ·{" "}
            {t.itemCount(itemCount)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {order.status === "PENDING" && order.expiresAt && (
            <Alert variant="warning" size="sm">
              {t.expiresAt(formatDate(order.expiresAt, "time"))}
            </Alert>
          )}
          <DataList size="sm">
            <DataListItem>
              <DataListLabel minWidth="6rem">{t.labels.total}</DataListLabel>
              <DataListValue>
                <Price
                  amount={order.grandTotal}
                  currency={order.currency}
                  size="sm"
                  showDiscount={false}
                />
              </DataListValue>
            </DataListItem>
            {shipTo && (
              <DataListItem>
                <DataListLabel minWidth="6rem">{t.labels.shipTo}</DataListLabel>
                <DataListValue>{shipTo}</DataListValue>
              </DataListItem>
            )}
          </DataList>
          <Stack asChild gap={3}>
            <ul aria-label={strings.orders.detail.items}>
              {order.items.slice(0, PREVIEW_ITEMS).map((item) => (
                <OrderLineItem
                  key={item.id}
                  item={item}
                  currency={order.currency}
                  size="sm"
                />
              ))}
            </ul>
          </Stack>
          {hidden > 0 && (
            <Text variant="body-3" foreground="muted">
              {t.moreItems(hidden)}
            </Text>
          )}
        </CardContent>

        <CardFooter justify="start">
          <LinkButton
            href={`/orders/${order.id}`}
            variant="outline"
            size="sm"
            rightIcon={
              <Icon size="sm">
                <ArrowRight />
              </Icon>
            }
            aria-label={`${t.viewDetails}, ${t.number(orderNumber(order.id))}`}
          >
            {t.viewDetails}
          </LinkButton>
        </CardFooter>
      </article>
    </Card>
  );
}
