"use client";

import * as React from "react";
import { Button, LinkButton, Price } from "@timmbr/ui";
import { strings } from "@/app/products/[slug]/strings";
import type { ProductVariant } from "@/lib/api/types";
import { CART_HREF } from "./useAddToCart";

export interface MobileBuyBarProps {
  variant: ProductVariant;
  /** The main Add to cart button: the bar shows only while it's off-screen. */
  target: React.RefObject<HTMLElement | null>;
  pending: boolean;
  onAdd: () => void;
  /** In the cart already: the bar leads to the cart instead. */
  showGoToCart: boolean;
}

/**
 * Phones and tablets: price + Add to cart pinned to the bottom while the main button is out of
 * view, so buying never needs a scroll back up. Hidden on desktop, where the button stays close.
 */
export function MobileBuyBar({
  variant,
  target,
  pending,
  onAdd,
  showGoToCart,
}: MobileBuyBarProps) {
  const [visible, setVisible] = React.useState(false);
  const copy = strings;
  const soldOut = variant.available <= 0;

  React.useEffect(() => {
    const node = target.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  // Toasts (snackbars on phones) rise above the bar while it shows. offsetHeight is 0 on
  // desktop, where the bar is display:none.
  const barRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const root = document.documentElement;
    const height = visible ? (barRef.current?.offsetHeight ?? 0) : 0;
    if (height > 0)
      root.style.setProperty("--toast-offset-bottom", `${height}px`);
    else root.style.removeProperty("--toast-offset-bottom");
    return () => {
      root.style.removeProperty("--toast-offset-bottom");
    };
  }, [visible]);

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      inert={!visible}
      data-visible={visible || undefined}
      className="fixed inset-x-0 bottom-0 z-30 translate-y-full border-t border-border-warm bg-grey-50/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgb(0_0_0/0.06)] backdrop-blur transition-transform duration-200 data-[visible]:translate-y-0 motion-reduce:transition-none lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <Price
          amount={variant.price}
          compareAt={variant.compareAtPrice}
          currency={variant.currency}
          size="sm"
          showDiscount={false}
          className="min-w-0 flex-1"
        />
        {showGoToCart ? (
          <LinkButton
            href={CART_HREF}
            crossZone
            variant="primary"
            className="h-11 flex-1 font-bold uppercase tracking-[0.07em]"
          >
            {copy.goToCart}
          </LinkButton>
        ) : (
          <Button
            variant="primary"
            className="h-11 flex-1 font-bold uppercase tracking-[0.07em]"
            disabled={soldOut || pending}
            loading={pending}
            onClick={onAdd}
          >
            {soldOut ? copy.soldOut : copy.addToCart}
          </Button>
        )}
      </div>
    </div>
  );
}
