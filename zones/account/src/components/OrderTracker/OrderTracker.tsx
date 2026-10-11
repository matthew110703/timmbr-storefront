import { Stepper } from "@timmbr/ui";
import { orderTracker } from "@/lib/orders";
import type { OrderStatus } from "@/lib/api/types";

/** Order progress (Placed → Confirmed → Shipped → Delivered; cancelled/returned end in red). */
export function OrderTracker({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) {
  const { steps, current, failed } = orderTracker(status);
  return (
    <Stepper
      aria-label={label}
      steps={steps}
      current={current}
      status={failed ? "error" : "default"}
    />
  );
}
