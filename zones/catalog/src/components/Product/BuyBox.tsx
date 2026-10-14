"use client";

import * as React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  LinkButton,
  OptionPicker,
  Price,
  QuantityStepper,
  StockMeter,
} from "@timmbr/ui";
import { Check, Heart, ShoppingBag, Truck } from "@timmbr/icons";
import { cn } from "@timmbr/utils";
import { strings } from "@/app/products/[slug]/strings";
import type { ProductDetail, ProductVariant } from "@/lib/api/types";
import { optionImages, optionStates } from "@/lib/product";
import { TrustBadges } from "./TrustBadges";
import { CART_HREF, useAddToCart } from "./useAddToCart";
import { useWishlist } from "./useWishlist";

export interface BuyBoxProps {
  product: ProductDetail;
  variant: ProductVariant;
  onSelectOption: (key: string, value: string) => void;
  trust: { items: { icon?: string; label: string }[]; note?: string };
  /** The buy buttons row (the mobile bar shows while it's off-screen). */
  actionsRef?: React.Ref<HTMLDivElement>;
  /** Shared with the mobile bar, so both add the same quantity. */
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  cart: ReturnType<typeof useAddToCart>;
  onAdd: () => void;
  /** Units of this variant already in the cart. */
  inCart: number;
  /** In the cart and not adding more: the button becomes "Go to cart". */
  showGoToCart: boolean;
  onAddMore: () => void;
}

/** The first non-swatch option group whose every option has its own photo, with those photos. */
function findImageGroup(product: ProductDetail) {
  for (const group of product.optionGroups) {
    if (group.display === "SWATCH") continue;
    const images = optionImages(product, group.key);
    if (images) return { key: group.key, images };
  }
  return null;
}

/**
 * The product's buy column (Figma "Product Configuration Column"): title and SKU, price, one
 * picker per option, low-stock urgency, quantity + Add to cart + wishlist, delivery promise,
 * trust badges, then description, specifications and care in collapsible sections.
 */
export function BuyBox({
  product,
  variant,
  onSelectOption,
  trust,
  actionsRef,
  quantity,
  onQuantityChange,
  cart,
  onAdd,
  inCart,
  showGoToCart,
  onAddMore,
}: BuyBoxProps) {
  const copy = strings;
  const wishlist = useWishlist(product.id, variant.id);
  const soldOut = variant.available <= 0;
  const delivery = product.flags.fastDelivery
    ? copy.delivery.fast
    : copy.delivery.standard;
  // Photo tiles for one group only: the first (non-swatch) group whose every option has its own
  // photo. A second group with the same photos would just repeat them. (Memoized by the React
  // Compiler; a manual useMemo here can't be preserved.)
  const imageGroup = findImageGroup(product);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {product.flags.clearance && (
          <Badge variant="primary" size="sm" className="mb-2 self-start">
            {copy.clearance}
          </Badge>
        )}
        <h1 className="text-h4 font-bold text-grey-950 lg:text-[1.75rem] lg:leading-tight">
          {product.title}
        </h1>
        <p className="text-body-3 text-grey-500">
          {product.brand && (
            <>
              {copy.by}{" "}
              <Link
                href={`/products?brand=${product.brand.slug}`}
                className="font-semibold text-grey-700 underline-offset-4 hover:underline"
              >
                {product.brand.name}
              </Link>
              {" · "}
            </>
          )}
          {copy.productId(variant.sku)}
        </p>
      </div>

      <div className="flex flex-col gap-1 border-b border-grey-200 pb-5">
        <Price
          amount={variant.price}
          compareAt={variant.compareAtPrice}
          currency={variant.currency}
          size="lg"
          formatDiscount={copy.discount}
        />
        <p className="text-body-3 text-grey-500">{copy.taxNote}</p>
      </div>

      {product.optionGroups.map((group) => {
        const images = group.key === imageGroup?.key ? imageGroup.images : null;
        const states = optionStates(product, variant, group.key);
        // Colour swatches when the options have colours, photo tiles when every option has its
        // own photo (how it really looks beats a name), otherwise text chips.
        return (
          <OptionPicker
            key={group.key}
            label={group.name}
            display={
              group.display === "SWATCH" ? "swatch" : images ? "image" : "pill"
            }
            value={variant.options[group.key]}
            onChange={(value) => onSelectOption(group.key, value)}
            labels={copy.picker}
            options={group.options.map((option) => ({
              value: option.value,
              label: option.label,
              swatchHex: option.swatchHex,
              imageUrl: images?.[option.value] ?? null,
              state: states[option.value],
            }))}
          />
        );
      })}

      {soldOut ? (
        <p className="text-body-2 text-destructive" role="status">
          {copy.stock.outHint}
        </p>
      ) : (
        <StockMeter available={variant.available} label={copy.stock.low} />
      )}

      <div className="flex flex-col gap-2">
        <div ref={actionsRef} className="flex items-center gap-3">
          {showGoToCart ? (
            // Already in the cart: the next step is the cart, not adding it again.
            <LinkButton
              href={CART_HREF}
              crossZone
              variant="primary"
              leftIcon={<ShoppingBag aria-hidden="true" className="size-5" />}
              className="h-[52px] flex-1 text-body-2 font-bold uppercase tracking-[0.07em]"
            >
              {copy.goToCart}
            </LinkButton>
          ) : (
            <>
              <QuantityStepper
                size="lg"
                value={quantity}
                max={Math.max(1, variant.available - inCart)}
                onChange={onQuantityChange}
                disabled={soldOut}
                labels={copy.quantity}
              />
              <Button
                variant="primary"
                className="h-[52px] flex-1 text-body-2 font-bold uppercase tracking-[0.07em]"
                disabled={soldOut || cart.pending}
                loading={cart.pending}
                onClick={onAdd}
              >
                {soldOut
                  ? copy.soldOut
                  : cart.pending
                    ? copy.adding
                    : copy.addToCart}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            className="size-[52px] shrink-0 rounded-sm"
            aria-label={wishlist.label}
            aria-pressed={wishlist.saved}
            disabled={wishlist.pending}
            onClick={wishlist.toggle}
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "size-5",
                wishlist.saved && "fill-primary text-primary",
              )}
            />
          </Button>
        </div>
        {inCart > 0 && (
          <p
            className="flex flex-wrap items-center gap-x-1.5 text-body-3 text-grey-700"
            role="status"
          >
            <Check aria-hidden="true" className="size-4 text-success" />
            <span>{copy.inCart(inCart)}</span>
            {showGoToCart && !soldOut && variant.available > inCart && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onAddMore}
                  className="font-semibold text-grey-950 underline underline-offset-4 hover:text-primary"
                >
                  {copy.addMore}
                </button>
              </>
            )}
          </p>
        )}
        {cart.error && (
          <p className="text-body-3 text-destructive" role="alert">
            {cart.error.message}
          </p>
        )}
      </div>

      <p className="flex items-center justify-center gap-2 text-body-2 text-grey-700">
        <Truck aria-hidden="true" className="size-4" />
        <span>
          {delivery.lead}{" "}
          <strong className="font-bold text-grey-950">{delivery.value}</strong>
        </span>
      </p>

      <div className="border-y border-grey-200 py-2">
        <TrustBadges items={trust.items} note={trust.note} />
      </div>

      <Accordion type="multiple" defaultValue={["description"]}>
        {(product.description || product.shortDescription) && (
          <AccordionItem value="description">
            <AccordionTrigger className="text-body-1 font-bold">
              {copy.sections.description}
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-line text-body-2 leading-relaxed text-grey-600">
                {product.description || product.shortDescription}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}
        {product.specs.length > 0 && (
          <AccordionItem value="specifications">
            <AccordionTrigger className="text-body-1 font-bold">
              {copy.sections.specifications}
            </AccordionTrigger>
            <AccordionContent>
              <DataList orientation="justified" divided size="sm">
                {product.specs.map((spec) => (
                  <DataListItem key={spec.label}>
                    <DataListLabel>{spec.label}</DataListLabel>
                    <DataListValue>{spec.value}</DataListValue>
                  </DataListItem>
                ))}
              </DataList>
            </AccordionContent>
          </AccordionItem>
        )}
        <AccordionItem value="care">
          <AccordionTrigger className="text-body-1 font-bold">
            {copy.sections.care}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body-2 text-grey-600">
              {copy.sections.careBody.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
