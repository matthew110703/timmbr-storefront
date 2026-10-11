import { notFound } from "next/navigation";
import { isApiError } from "@/lib/api/client";
import { serverGet, serverGetPaginated } from "@/lib/api/server";
import type { Address, Order, OrderStatus, Wishlist } from "@/lib/api/types";

/** Server-side reads for the account pages (timmbr-core, signed-in user). */

export const ORDERS_PAGE_SIZE = 10;

export function listOrders({
  status,
  page,
}: {
  status?: OrderStatus[];
  page: number;
}) {
  return serverGetPaginated<Order>("/orders", {
    params: {
      page,
      limit: ORDERS_PAGE_SIZE,
      ...(status?.length && { status: status.join(",") }),
    },
    returnTo: "/account/orders",
  });
}

/** How many orders (optionally with these statuses) the user has; reads one row. */
export async function countOrders(status?: OrderStatus[]): Promise<number> {
  const { meta } = await serverGetPaginated<Order>("/orders", {
    params: {
      page: 1,
      limit: 1,
      ...(status?.length && { status: status.join(",") }),
    },
    returnTo: "/account",
  });
  return meta.total;
}

/** One of the user's orders; 404 when it doesn't exist or isn't theirs. */
export async function getOrder(orderId: string): Promise<Order> {
  try {
    return await serverGet<Order>(`/orders/${encodeURIComponent(orderId)}`, {
      returnTo: `/account/orders/${orderId}`,
    });
  } catch (error) {
    // Core answers 403 for someone else's order: same "not found" for privacy.
    if (isApiError(error) && [400, 403, 404].includes(error.statusCode))
      notFound();
    throw error;
  }
}

export function listAddresses() {
  return serverGet<Address[]>("/addresses", { returnTo: "/account/addresses" });
}

export function getWishlist() {
  return serverGet<Wishlist>("/wishlist", { returnTo: "/account/wishlist" });
}
