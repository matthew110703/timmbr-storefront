import { Badge } from "@timmbr/ui";
import { orderStatusDisplay, paymentStatusDisplay } from "@/lib/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/api/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = orderStatusDisplay(status);
  return (
    <Badge variant={tone} size="sm">
      {label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, tone } = paymentStatusDisplay(status);
  return (
    <Badge variant={tone} size="sm">
      {label}
    </Badge>
  );
}
