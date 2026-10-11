import type { BadgeProps } from "@timmbr/ui";
import { strings } from "@/app/strings";
import type { OrderStatus, PaymentStatus } from "@/lib/api/types";

/** Order filters (tabs) → the statuses each one asks core for. */
export const ORDER_FILTERS = {
  all: [],
  pending: ["PENDING"],
  active: ["CONFIRMED", "PROCESSING", "SHIPPED"],
  delivered: ["DELIVERED"],
  closed: ["CANCELLED", "RETURNED"],
} as const satisfies Record<string, readonly OrderStatus[]>;

export type OrderFilter = keyof typeof ORDER_FILTERS;

export function parseOrderFilter(
  value: string | string[] | undefined,
): OrderFilter {
  const key = Array.isArray(value) ? value[0] : value;
  return key && key in ORDER_FILTERS ? (key as OrderFilter) : "all";
}

/**
 * Short, readable order reference. Core has no order-number field yet, so
 * show the first 8 characters of the id (all in one place, easy to swap).
 */
export function orderNumber(orderId: string): string {
  return orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

type Tone = NonNullable<BadgeProps["variant"]>;

const STATUS_TONE: Record<OrderStatus, Tone> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "subtle",
  RETURNED: "subtle",
};

const PAYMENT_TONE: Record<PaymentStatus, Tone> = {
  PENDING: "warning",
  PROCESSING: "info",
  PAID: "success",
  FAILED: "destructive",
  CANCELLED: "subtle",
  REFUNDED: "subtle",
  PARTIALLY_REFUNDED: "subtle",
};

export function orderStatusDisplay(status: OrderStatus) {
  return {
    label: strings.orders.status[status] ?? status,
    tone: STATUS_TONE[status] ?? "subtle",
  };
}

export function paymentStatusDisplay(status: PaymentStatus) {
  return {
    label: strings.orders.paymentStatus[status] ?? status,
    tone: PAYMENT_TONE[status] ?? "subtle",
  };
}

/**
 * Steps for the order tracker. Normal path: Placed → Confirmed → Shipped →
 * Delivered. Cancelled and returned orders end with a failed step.
 */
export function orderTracker(status: OrderStatus): {
  steps: { id: string; label: string }[];
  current: number;
  failed: boolean;
} {
  const t = strings.orders.tracker;
  const normal = [
    { id: "placed", label: t.placed },
    { id: "confirmed", label: t.confirmed },
    { id: "shipped", label: t.shipped },
    { id: "delivered", label: t.delivered },
  ];
  switch (status) {
    case "PENDING":
      return { steps: normal, current: 0, failed: false };
    case "CONFIRMED":
    case "PROCESSING":
      return { steps: normal, current: 1, failed: false };
    case "SHIPPED":
      return { steps: normal, current: 2, failed: false };
    case "DELIVERED":
      // Every step done
      return { steps: normal, current: normal.length, failed: false };
    case "CANCELLED":
      return {
        steps: [normal[0], { id: "cancelled", label: t.cancelled }],
        current: 1,
        failed: true,
      };
    case "RETURNED":
      return {
        steps: [...normal, { id: "returned", label: t.returned }],
        current: 4,
        failed: true,
      };
  }
}
