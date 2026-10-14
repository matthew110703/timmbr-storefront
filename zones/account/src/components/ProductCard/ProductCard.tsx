import Image from "next/image";
import {
  Badge,
  Icon,
  Inline,
  MediaCard,
  Price,
  Rating,
  Text,
} from "@timmbr/ui";
import { Heart, Palette, ShoppingBag, Truck } from "@timmbr/icons";
import { cn } from "@timmbr/utils";

export interface ProductCardProps {
  title: string;
  /** Product page (another app: a full navigation). */
  href: string;
  image: string | null;
  imageAlt?: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  /** Top-left tag, e.g. "Bestseller" or "Out of stock". */
  badge?: string;
  /** Line above the title, e.g. "1+ Options" or the chosen variant. */
  optionsLabel?: string;
  rating?: { value: number; count?: number };
  /** e.g. "Ships in 2 Days". */
  shippingNote?: string;
  /** Heart button on the image. */
  wishlist?: {
    saved: boolean;
    label: string;
    onToggle: () => void;
    disabled?: boolean;
  };
  /** Buttons under the card (kept above the card's link). */
  footer?: React.ReactNode;
  as?: "li" | "article" | "div";
  /** `sizes` for the image (defaults to a 2 / 3 / 4-column grid). */
  imageSizes?: string;
  /** Load the image eagerly (cards in the first visible row: the LCP). */
  eager?: boolean;
  className?: string;
}

/** Figma "Product card" (node 140:4211) image proportions. */
const PRODUCT_IMAGE_RATIO = "171/147";

/**
 * Storefront product card (Figma "Product card", node 140:4211), composed from
 * the DS MediaCard template: the whole card links to the product, the heart
 * and `footer` stay clickable above it. Optional parts (options line, rating,
 * shipping note) are left out when there's no data for them.
 */
export function ProductCard({
  title,
  href,
  image,
  imageAlt = "",
  price,
  compareAtPrice,
  currency,
  badge,
  optionsLabel,
  rating,
  shippingNote,
  wishlist,
  footer,
  as = "li",
  imageSizes = "(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw",
  eager = false,
  className,
}: ProductCardProps) {
  const infoRow = rating || shippingNote;

  return (
    <MediaCard
      as={as}
      className={className}
      href={href}
      ratio={PRODUCT_IMAGE_RATIO}
      mediaZoom
      titleSize="sm"
      spacing="relaxed"
      media={
        image && (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes={imageSizes}
            loading={eager ? "eager" : undefined}
          />
        )
      }
      mediaFallback={
        <Icon size="xl">
          <ShoppingBag />
        </Icon>
      }
      mediaTopStart={
        badge && (
          <Badge variant="primary" size="sm">
            {badge}
          </Badge>
        )
      }
      mediaTopEnd={
        wishlist && (
          // A bare heart on the photo (white outline, filled when saved), above the card's link.
          <button
            type="button"
            aria-label={wishlist.label}
            aria-pressed={wishlist.saved}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              wishlist.onToggle();
            }}
            disabled={wishlist.disabled}
            className="flex size-9 items-center justify-center rounded-full text-grey-50 drop-shadow-[0_1px_2px_rgb(0_0_0/0.45)] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-50 disabled:opacity-60"
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "size-6 stroke-[1.75]",
                wishlist.saved && "fill-primary text-primary",
              )}
            />
          </button>
        )
      }
      eyebrow={
        optionsLabel && (
          <>
            <Icon size="sm" foreground="primary">
              <Palette />
            </Icon>
            <Text as="span" variant="body-3" foreground="muted" truncate>
              {optionsLabel}
            </Text>
          </>
        )
      }
      titleAs="h3"
      title={title}
      meta={
        infoRow && (
          <Inline gap={2} justify={rating ? "between" : "end"} wrap={false}>
            {rating && <Rating value={rating.value} count={rating.count} />}
            {shippingNote && (
              <Inline asChild gap={1} wrap={false}>
                <Text as="span" variant="body-2">
                  <Icon size="sm" foreground="primary">
                    <Truck />
                  </Icon>
                  {shippingNote}
                </Text>
              </Inline>
            )}
          </Inline>
        )
      }
      aside={
        <Price amount={price} compareAt={compareAtPrice} currency={currency} />
      }
      footer={footer}
    />
  );
}
