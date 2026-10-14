"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Button, Card, Icon, Price, Stack, Text } from "@timmbr/ui";
import { ChevronDown, Heart, Package } from "@timmbr/icons";
import { cn } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { CollapsePanel } from "@/components/CollapsePanel";
import { useIsDesktop } from "@/lib/media";
import type { SavedItem } from "@/lib/api/types";

const t = strings.saved;

export interface SavedForLaterProps {
  items: SavedItem[];
  busy?: boolean;
  className?: string;
  onMoveToCart: (item: SavedItem) => void;
}

/**
 * The shopper's wishlist, under the cart: anything they hesitated on, one tap from the cart.
 * Hidden when there is nothing saved. On phones it is a slim row that stays closed until asked
 * for, so it never pushes delivery and payment down the page; from `lg` up the grid is always
 * open.
 */
export function SavedForLater({
  items,
  busy = false,
  className,
  onMoveToCart,
}: SavedForLaterProps) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const desktop = useIsDesktop();

  if (items.length === 0) return null;

  return (
    <Card
      variant="subtle"
      padding="none"
      className={cn("overflow-hidden", className)}
      data-testid="saved-for-later"
    >
      <h2 className="m-0">
        <button
          type="button"
          // On desktop the grid is always open and the header is only a title.
          aria-expanded={desktop ? undefined : open}
          aria-controls={desktop ? undefined : bodyId}
          tabIndex={desktop ? -1 : undefined}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center gap-2 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:pointer-events-none lg:px-5 lg:pb-2 lg:pt-5"
        >
          <Icon size="sm">
            <Heart />
          </Icon>
          <Text variant="body-1" weight="semibold" className="flex-1">
            {t.title(items.length)}
          </Text>
          <span
            aria-hidden="true"
            className={cn(
              "text-muted-foreground transition-transform duration-200 motion-reduce:transition-none lg:hidden",
              open && "rotate-180",
            )}
          >
            <Icon size="sm">
              <ChevronDown />
            </Icon>
          </span>
        </button>
      </h2>
      <CollapsePanel id={bodyId} open={open} openOnDesktop>
        <div className="px-4 pb-4 lg:px-5 lg:pb-5">
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li
                key={item.variantId}
                className="flex flex-col gap-1.5 rounded-[6px] border border-border p-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-bg-subtle">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 160px, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Icon size="md">
                        <Package />
                      </Icon>
                    </div>
                  )}
                </div>
                <Stack gap={1} className="min-w-0 flex-1">
                  <Text
                    variant="body-3"
                    weight="medium"
                    className="line-clamp-2"
                  >
                    {item.product.title}
                  </Text>
                  <Price
                    amount={item.variant.price}
                    compareAt={item.variant.compareAtPrice}
                    currency={item.variant.currency}
                    size="sm"
                  />
                </Stack>
                {item.isAvailable ? (
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    disabled={busy}
                    aria-label={t.moveToCartAria(item.product.title)}
                    onClick={() => onMoveToCart(item)}
                  >
                    {t.moveToCart}
                  </Button>
                ) : (
                  <Text
                    variant="body-3"
                    foreground="muted"
                    className="text-center"
                  >
                    {t.soldOut}
                  </Text>
                )}
              </li>
            ))}
          </ul>
        </div>
      </CollapsePanel>
    </Card>
  );
}
