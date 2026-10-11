import type { Metadata } from "next";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  Grid,
  PageHeader,
  Price,
  Stack,
  Text,
} from "@timmbr/ui";
import { formatCurrency, formatDate } from "@timmbr/utils";
import { OrderLineItem } from "@/components/OrderLineItem";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/OrderStatusBadge";
import { OrderTracker } from "@/components/OrderTracker";
import { getOrder } from "@/lib/api/account";
import { orderNumber } from "@/lib/orders";
import { strings } from "@/app/strings";

const t = strings.orders;

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `${t.number(orderNumber(orderId))} | timmbr` };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  const money = (amount: number) => formatCurrency(amount, order.currency);
  const address = order.shippingAddress;
  const payment = order.payments?.[0];
  const d = t.detail;

  return (
    <Stack gap={6}>
      <PageHeader
        as="h2"
        // Same app: LinkButton adds the /account base path.
        back={{ href: "/orders", label: d.back }}
        title={t.number(orderNumber(order.id))}
        description={t.placedOn(
          formatDate(order.placedAt ?? order.createdAt, "dateTime"),
        )}
        actions={<OrderStatusBadge status={order.status} />}
      />

      <Card padding="lg">
        <Stack gap={4}>
          <OrderTracker status={order.status} label={d.progress} />
          {order.status === "PENDING" && order.expiresAt && (
            <Alert variant="warning" size="sm">
              {t.expiresAt(formatDate(order.expiresAt, "time"))}
            </Alert>
          )}
        </Stack>
      </Card>

      <Grid cols={1} gap={6} template={{ xl: "minmax(0,1fr) 20rem" }}>
        <Card sectioned padding="sm">
          <CardHeader>
            <CardTitle>{d.items}</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack asChild gap={4}>
              <ul>
                {order.items.map((item) => (
                  <OrderLineItem
                    key={item.id}
                    item={item}
                    currency={order.currency}
                  />
                ))}
              </ul>
            </Stack>
          </CardContent>
        </Card>

        <Stack gap={6}>
          <Card sectioned padding="sm">
            <CardHeader>
              <CardTitle>{d.summary}</CardTitle>
            </CardHeader>
            <CardContent>
              <DataList size="sm" orientation="justified">
                <DataListItem>
                  <DataListLabel>{d.subtotal}</DataListLabel>
                  <DataListValue>{money(order.subtotal)}</DataListValue>
                </DataListItem>
                {order.discount > 0 && (
                  <DataListItem>
                    <DataListLabel>{d.discount}</DataListLabel>
                    <DataListValue>− {money(order.discount)}</DataListValue>
                  </DataListItem>
                )}
                <DataListItem>
                  <DataListLabel>{d.shipping}</DataListLabel>
                  <DataListValue>
                    {order.shippingFee > 0 ? money(order.shippingFee) : d.free}
                  </DataListValue>
                </DataListItem>
              </DataList>
              <DataList size="sm" orientation="justified" divided>
                <DataListItem emphasis="total">
                  <DataListLabel>{d.total}</DataListLabel>
                  <DataListValue>
                    <Price
                      amount={order.grandTotal}
                      currency={order.currency}
                      size="sm"
                      showDiscount={false}
                    />
                  </DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>{d.paymentStatus}</DataListLabel>
                  <DataListValue>
                    {payment ? (
                      <PaymentStatusBadge status={payment.status} />
                    ) : (
                      d.noPayment
                    )}
                  </DataListValue>
                </DataListItem>
              </DataList>
              {order.tax > 0 && (
                <Text variant="caption" foreground="muted">
                  {d.taxIncluded(money(order.tax))}
                </Text>
              )}
            </CardContent>
          </Card>

          {address && (
            <Card sectioned padding="sm">
              <CardHeader>
                <CardTitle>{d.shippingAddress}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text asChild variant="body-2" italic={false}>
                  <address>
                    <Stack gap={1}>
                      <Stack gap={0.5}>
                        <Text as="span" variant="body-2-medium">
                          {address.firstName} {address.lastName}
                        </Text>
                        <span>{address.line1}</span>
                        {address.line2 && <span>{address.line2}</span>}
                        <span>
                          {address.city}, {address.state} {address.postalCode}
                        </span>
                      </Stack>
                      {address.phone && (
                        <Text as="span" variant="body-2" foreground="muted">
                          {address.phone}
                        </Text>
                      )}
                    </Stack>
                  </address>
                </Text>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Grid>
    </Stack>
  );
}
