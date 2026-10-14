"use client";

import Image from "next/image";
import {
  Button,
  Icon,
  Inline,
  Price,
  QuantityStepper,
  Stack,
  Text,
} from "@timmbr/ui";
import { Heart, Package, Trash2 } from "@timmbr/icons";
import { strings } from "@/app/strings";
import type { CartLine } from "@/lib/api/types";

const t = strings.cart;

export interface CartLineCardProps {
  line: CartLine;
  /** A change to the cart is in flight: the controls are disabled. */
  busy?: boolean;
  onQuantityChange: (line: CartLine, quantity: number) => void;
  onRemove: (line: CartLine) => void;
  onSaveForLater: (line: CartLine) => void;
}

/**
 * One cart line: photo, name and options, a +/- quantity stepper (buttons, not a dropdown: the
 * easier control on a phone), price, and the two things a shopper does with a line they are
 * unsure of: save it for later, or remove it.
 */
export function CartLineCard({
  line,
  busy = false,
  onQuantityChange,
  onRemove,
  onSaveForLater,
}: CartLineCardProps) {
  const purchasable = line.isAvailable && line.availableQuantity > 0;
  const options = Object.values(line.attributes ?? {}).join(" · ");

  return (
    <article
      data-testid="cart-line"
      aria-busy={busy}
      className="flex gap-4 border-b border-border py-4"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[4px] bg-bg-subtle sm:size-[104px]">
        {line.thumbnail ? (
          <Image
            src={line.thumbnail}
            alt=""
            fill
            sizes="104px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon size="lg">
              <Package />
            </Icon>
          </div>
        )}
      </div>

      <Stack gap={2} className="min-w-0 flex-1">
        <Stack gap={1}>
          <Text variant="body-2" weight="semibold" className="line-clamp-2">
            {line.name}
          </Text>
          {options && (
            <Text variant="body-3" foreground="muted">
              {options}
            </Text>
          )}
        </Stack>

        {purchasable ? (
          <>
            <Inline gap={3} align="center" justify="between">
              <QuantityStepper
                size="md"
                value={line.quantity}
                min={1}
                max={line.availableQuantity}
                labels={{
                  group: t.quantityGroup(line.name),
                  decrease: t.quantity.decrease,
                  increase: t.quantity.increase,
                }}
                onChange={(quantity) => onQuantityChange(line, quantity)}
              />
              <Price
                amount={Number(line.totalPrice)}
                currency={line.currency}
                size="sm"
              />
            </Inline>
            {line.availableQuantity <= 5 && (
              <Text variant="body-3" foreground="warning" weight="medium">
                {t.onlyLeft(line.availableQuantity)}
              </Text>
            )}
          </>
        ) : (
          <Text variant="body-3" foreground="destructive" weight="medium">
            {t.unavailable}
          </Text>
        )}

        <Inline gap={4} align="center">
          <Button
            variant="link"
            size="sm"
            leftIcon={<Heart />}
            aria-label={t.saveForLaterAria(line.name)}
            onClick={() => onSaveForLater(line)}
          >
            {t.saveForLater}
          </Button>
          <Button
            variant="link"
            size="sm"
            leftIcon={<Trash2 />}
            aria-label={t.removeAria(line.name)}
            onClick={() => onRemove(line)}
            className="text-muted-foreground"
          >
            {t.remove}
          </Button>
        </Inline>
      </Stack>
    </article>
  );
}
