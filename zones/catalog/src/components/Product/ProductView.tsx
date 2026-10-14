"use client";

import * as React from "react";
import Image from "next/image";
import { useCartQuantity } from "@timmbr/auth";
import { ProductGallery } from "@timmbr/ui";
import { strings } from "@/app/products/[slug]/strings";
import type { ProductDetail } from "@/lib/api/types";
import { selectOption, variantHref, variantImages } from "@/lib/product";
import { BuyBox } from "./BuyBox";
import { MobileBuyBar } from "./MobileBuyBar";
import { useRecordRecentlyViewed } from "./RecentlyViewed";
import { useAddToCart } from "./useAddToCart";

export interface ProductViewProps {
  product: ProductDetail;
  /** The variant the URL asked for (resolved on the server, so the first paint is right). */
  initialVariantId: string;
  trust: { items: { icon?: string; label: string }[]; note?: string };
}

/**
 * Gallery + buy column. Every variant is in the page data, so picking an option switches price,
 * stock, SKU and images instantly; the URL follows (`?finish=walnut`, replaced, not pushed) so a
 * shared link opens the same variant.
 */
export function ProductView({
  product,
  initialVariantId,
  trust,
}: ProductViewProps) {
  const [variantId, setVariantId] = React.useState(initialVariantId);
  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const [quantity, setQuantity] = React.useState(1);
  // Never ask for more than this variant has.
  const boundedQuantity = Math.max(
    1,
    Math.min(quantity, variant.available || 1),
  );
  const actionsRef = React.useRef<HTMLDivElement>(null);
  const cart = useAddToCart();
  const { clearError } = cart;
  // Once this variant is in the cart, the button leads to the cart ("Add more" brings it back).
  const inCart = useCartQuantity(variant.id);
  const [addingMoreOf, setAddingMoreOf] = React.useState<string | null>(null);
  const showGoToCart = inCart > 0 && addingMoreOf !== variant.id;

  const add = async () => {
    const failed = await cart.add(variant.id, boundedQuantity, product.title);
    if (!failed) {
      setAddingMoreOf(null);
      setQuantity(1);
    }
  };

  useRecordRecentlyViewed(product);

  const onSelectOption = (key: string, value: string) => {
    const next = selectOption(product, variant, key, value);
    if (next.id === variant.id) return;
    setVariantId(next.id);
    clearError();
    window.history.replaceState(null, "", variantHref(product, next));
  };

  const images = React.useMemo(
    () =>
      variantImages(product, variant.id).map((image) => ({
        src: image.url,
        alt: image.alt,
      })),
    [product, variant.id],
  );
  // A different image set (another variant's photos) starts from its first image.
  const galleryKey = images.map((image) => image.src).join("|");

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
        <ProductGallery
          key={galleryKey}
          images={images}
          aspectRatio="4 / 3"
          thumbnails="left"
          zoomScale={2}
          sizes="(min-width: 1440px) 620px, (min-width: 1024px) 45vw, 100vw"
          labels={{
            ...strings.gallery,
            position: (i, n) => `${i + 1} of ${n}`,
            openFullscreen: (i, n) =>
              `Open image ${i + 1} of ${n} in full screen`,
            thumbnail: (i, n) => `Show image ${i + 1} of ${n}`,
          }}
          renderImage={(image, { priority, sizes, className }) => (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              priority={priority}
              draggable={false}
              className={className}
            />
          )}
          // The buy column is the taller one, so the images stay in view while it scrolls; z-20
          // keeps the hover zoom pane (drawn over the buy column) above it.
          className="-mx-4 sm:mx-0 lg:sticky lg:top-[5.5rem] lg:z-20 lg:self-start [&_[data-slot=product-gallery-thumbs]]:px-4 sm:[&_[data-slot=product-gallery-thumbs]]:px-0"
        />
        <div>
          <BuyBox
            product={product}
            variant={variant}
            onSelectOption={onSelectOption}
            trust={trust}
            actionsRef={actionsRef}
            quantity={boundedQuantity}
            onQuantityChange={(next) => {
              setQuantity(next);
              clearError();
            }}
            cart={cart}
            onAdd={() => void add()}
            inCart={inCart}
            showGoToCart={showGoToCart}
            onAddMore={() => setAddingMoreOf(variant.id)}
          />
        </div>
      </div>
      <MobileBuyBar
        variant={variant}
        target={actionsRef}
        pending={cart.pending}
        onAdd={() => void add()}
        showGoToCart={showGoToCart}
      />
    </>
  );
}
