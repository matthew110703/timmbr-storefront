import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isApiError } from "@timmbr/utils";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { serverGet } from "@/lib/api/server";
import type { Order } from "@/lib/api/types";
import { strings } from "./strings";

export const metadata: Metadata = { title: strings.metadata.title };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();

  let order: Order;
  try {
    order = await serverGet<Order>(`/orders/${encodeURIComponent(orderId)}`, {
      returnTo: "/checkout",
    });
  } catch (error) {
    // Someone else's order or a made-up id: don't confirm anything.
    if (isApiError(error) && [403, 404].includes(error.statusCode)) notFound();
    throw error;
  }

  return <OrderConfirmation order={order} />;
}
