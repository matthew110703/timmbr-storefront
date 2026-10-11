import Image from "next/image";
import { Icon, MediaCard, Price } from "@timmbr/ui";
import { Package } from "@timmbr/icons";
import { formatCurrency } from "@timmbr/utils";
import { strings } from "@/app/strings";
import type { OrderItem } from "@/lib/api/types";
import { itemTitle } from "@/lib/user";

interface OrderLineItemProps {
  item: OrderItem;
  currency: string;
  size?: "sm" | "md";
}

/** One product of an order: thumbnail, name, SKU, quantity × unit price, total. */
export function OrderLineItem({
  item,
  currency,
  size = "md",
}: OrderLineItemProps) {
  const thumbnailSize = size === "sm" ? 64 : 96;

  return (
    <MediaCard
      as="li"
      orientation="horizontal"
      size={size}
      titleAs="p"
      media={
        item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt=""
            width={thumbnailSize}
            height={thumbnailSize}
          />
        )
      }
      mediaFallback={
        <Icon size="lg">
          <Package />
        </Icon>
      }
      title={itemTitle(item.name, item.sku)}
      subtitle={item.sku}
      meta={strings.orders.quantity(
        item.quantity,
        formatCurrency(item.unitPrice, currency),
      )}
      aside={<Price amount={item.totalPrice} currency={currency} size="sm" />}
    />
  );
}
