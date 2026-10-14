export const strings = {
  metadata: {
    title: "timmbr | Order placed",
  },
  confirmed: {
    title: "Thank you, your order is placed",
    description: (orderRef: string) =>
      `Order #${orderRef} is confirmed. We will email you when it ships.`,
  },
  processing: {
    title: "We are confirming your payment",
    description: (orderRef: string) =>
      `Order #${orderRef} is being processed. This usually takes a moment; check your orders shortly.`,
  },
  total: "Total paid",
  items: (count: number) => `${count} ${count === 1 ? "item" : "items"}`,
  viewOrder: "View order",
  viewOrderHref: (orderId: string) => `/account/orders/${orderId}`,
  continueShopping: "Continue shopping",
  continueHref: "/products",
} as const;
