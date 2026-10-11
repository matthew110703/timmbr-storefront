import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderCard } from "./OrderCard";
import { strings } from "@/app/strings";
import type { Order } from "@/lib/api/types";

const item = (n: number) => ({
  id: `i${n}`,
  productId: "p",
  variantId: `v${n}`,
  name: `Chair ${n}`,
  sku: `SKU-${n}`,
  quantity: 1,
  unitPrice: 1000,
  totalPrice: 1000,
  thumbnail: null,
});

const order: Order = {
  id: "8f2a91c3-77b0-4e2a-9c1d-000000000000",
  status: "SHIPPED",
  subtotal: 3000,
  discount: 0,
  shippingFee: 0,
  tax: 540,
  grandTotal: 3540,
  currency: "INR",
  shippingAddress: { firstName: "Arul", lastName: "Raj", city: "Chennai" },
  placedAt: "2026-10-07T10:15:00.000Z",
  expiresAt: null,
  createdAt: "2026-10-07T10:00:00.000Z",
  items: [item(1), item(2), item(3)],
};

describe("OrderCard", () => {
  it("shows number, status, total, ship-to, first items and a details link", () => {
    render(<OrderCard order={order} />);

    expect(
      screen.getByRole("heading", { name: strings.orders.number("8F2A91C3") }),
    ).toBeInTheDocument();
    expect(screen.getByText(strings.orders.status.SHIPPED)).toBeInTheDocument();
    expect(screen.getByText("₹3,540")).toBeInTheDocument();
    expect(screen.getByText("Arul Raj, Chennai")).toBeInTheDocument();
    expect(screen.getByText("Chair 1")).toBeInTheDocument();
    expect(screen.queryByText("Chair 3")).toBeNull();
    expect(screen.getByText(strings.orders.moreItems(1))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View details/ })).toHaveAttribute(
      "href",
      `/orders/${order.id}`,
    );
  });

  it("shows when an unpaid order expires", () => {
    render(
      <OrderCard
        order={{
          ...order,
          status: "PENDING",
          expiresAt: "2026-10-07T10:30:00.000Z",
        }}
      />,
    );
    expect(screen.getByText(/Awaiting payment · expires/)).toBeInTheDocument();
  });
});
