import { ScrollRail } from "@timmbr/ui";
import {
  WishlistProductCard,
  type ProductCardProps,
} from "@/components/ProductCard";

export type RailProduct = Pick<
  ProductCardProps,
  | "title"
  | "href"
  | "image"
  | "imageAlt"
  | "price"
  | "compareAtPrice"
  | "currency"
  | "badge"
  | "optionsLabel"
> & {
  key: string;
  productId: string;
  /** What the heart saves; no heart without one. */
  variantId: string | null;
};

/**
 * A titled horizontal row of product cards: swipe on phones (two and a bit visible, so it reads
 * as scrollable), four across on desktop.
 */
export function ProductRail({
  title,
  products,
}: {
  title: string;
  products: RailProduct[];
}) {
  const headingId = `rail-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <h2
        id={headingId}
        className="font-display text-h4 text-grey-950 lg:text-h3"
      >
        {title}
      </h2>
      <ScrollRail gap="sm">
        {products.map(({ key, ...product }) => (
          <WishlistProductCard
            key={key}
            {...product}
            imageSizes="(min-width: 1440px) 300px, (min-width: 1024px) 22vw, 42vw"
            className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-3.75rem)/4)]"
          />
        ))}
      </ScrollRail>
    </section>
  );
}
