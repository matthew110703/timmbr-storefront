"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  EmptyState,
  Grid,
  Icon,
  LinkButton,
  PageHeader,
  Stack,
  toast,
} from "@timmbr/ui";
import { Heart, ShoppingCart } from "@timmbr/icons";
import { isApiError } from "@timmbr/utils";
import { ProductCard } from "@/components/ProductCard";
import { cartApi, wishlistApi } from "@/lib/api/browser";
import { strings } from "@/app/strings";
import type { WishlistItem } from "@/lib/api/types";

const t = strings.wishlist;
const errorMessage = (error: unknown) =>
  isApiError(error) && error.message ? error.message : strings.errors.generic;

/** The wishlist: remove (heart), or move to the cart (add, then remove from the list). */
export function WishlistGrid({ items }: { items: WishlistItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (
    variantId: string,
    action: () => Promise<void>,
    done: string,
  ) => {
    setBusy(variantId);
    try {
      await action();
      toast.success(done);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const remove = (item: WishlistItem) =>
    run(
      item.variantId,
      async () => void (await wishlistApi.remove(item.variantId)),
      t.removed,
    );

  const moveToCart = (item: WishlistItem) =>
    run(
      item.variantId,
      async () => {
        await cartApi.add(item.variantId, 1);
        await wishlistApi.remove(item.variantId);
      },
      t.moved,
    );

  return (
    <Stack gap={6}>
      <PageHeader as="h2" title={t.title} description={t.description} />

      {items.length === 0 ? (
        <EmptyState
          variant="bordered"
          fullWidth
          icon={
            <Icon size="lg" foreground="primary">
              <Heart />
            </Icon>
          }
          title={t.empty.title}
          description={t.empty.description}
          action={
            <LinkButton href="/products" crossZone variant="primary">
              {t.empty.cta}
            </LinkButton>
          }
        />
      ) : (
        <Grid asChild cols={{ base: 2, sm: 3, xl: 4 }} colGap={4} rowGap={8}>
          <ul>
            {items.map((item, index) => (
              <ProductCard
                key={item.id}
                eager={index < 4}
                title={item.product.title}
                href={`/products/${item.product.slug}`}
                image={item.thumbnail}
                price={item.variant.price}
                compareAtPrice={item.variant.compareAtPrice}
                currency={item.variant.currency}
                badge={item.isAvailable ? undefined : t.unavailable}
                wishlist={{
                  saved: true,
                  label: t.removeFrom(item.product.title),
                  onToggle: () => void remove(item),
                  disabled: busy !== null,
                }}
                footer={
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    leftIcon={<ShoppingCart />}
                    disabled={!item.isAvailable || busy !== null}
                    loading={busy === item.variantId}
                    onClick={() => moveToCart(item)}
                  >
                    {t.moveToCart}
                  </Button>
                }
              />
            ))}
          </ul>
        </Grid>
      )}
    </Stack>
  );
}
