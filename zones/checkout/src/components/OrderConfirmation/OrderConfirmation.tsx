import { Button, Card, EmptyState, Inline, Stack, Text } from "@timmbr/ui";
import { CheckCircle } from "@timmbr/icons";
import { formatCurrency } from "@timmbr/utils";
import { strings } from "@/app/success/strings";
import type { Order } from "@/lib/api/types";

const PLACED = new Set(["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]);

export interface OrderConfirmationProps {
  order: Order;
}

/**
 * The confirmation, centred on the page. It only says "placed" once the order is CONFIRMED (or
 * later); while the webhook is still confirming the payment it says so instead.
 */
export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const copy = PLACED.has(order.status)
    ? strings.confirmed
    : strings.processing;
  const orderRef = order.id.slice(0, 8).toUpperCase();
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex justify-center py-8 lg:py-16">
      <EmptyState
        size="lg"
        className="w-full"
        icon={<CheckCircle />}
        title={copy.title}
        description={copy.description(orderRef)}
        action={
          <Stack gap={4} align="center" className="w-full">
            <Card variant="subtle" padding="none" className="px-5 py-3">
              <Inline gap={6} justify="center">
                <Text variant="body-2" foreground="muted">
                  {strings.items(count)}
                </Text>
                <Text variant="body-2" weight="semibold">
                  {strings.total}{" "}
                  {formatCurrency(order.grandTotal, order.currency)}
                </Text>
              </Inline>
            </Card>
            <Inline gap={3} justify="center">
              <Button asChild>
                {/* Plain links: orders and the store are other zones. */}
                <a href={strings.viewOrderHref(order.id)}>
                  {strings.viewOrder}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={strings.continueHref}>{strings.continueShopping}</a>
              </Button>
            </Inline>
          </Stack>
        }
      />
    </div>
  );
}
