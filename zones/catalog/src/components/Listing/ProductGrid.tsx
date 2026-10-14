import { strings } from "@/app/strings";
import type { ListingProduct } from "@/lib/api/types";
import { WishlistProductCard } from "@/components/ProductCard";

/** First row on every breakpoint (2 on phones, 3 on desktop): loaded eagerly, it's the LCP. */
const EAGER_COUNT = 3;

/**
 * The product cards: 2 columns on phones, 3 next to the filter sidebar. `sizes` matches that
 * layout so the browser picks the right image width.
 */
export function ProductGrid({ products }: { products: ListingProduct[] }) {
  const copy = strings.listing.card;
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3">
      {products.map((product, index) => (
        <WishlistProductCard
          key={product.id}
          productId={product.id}
          variantId={product.defaultVariantId}
          title={product.title}
          href={`/products/${product.slug}`}
          image={product.coverImage?.url ?? null}
          imageAlt={product.coverImage?.alt ?? product.title}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          currency={product.currency}
          badge={product.inStock ? undefined : copy.outOfStock}
          optionsLabel={product.hasMultipleVariants ? copy.options : undefined}
          imageSizes="(min-width: 1440px) 340px, (min-width: 1024px) 26vw, 50vw"
          eager={index < EAGER_COUNT}
        />
      ))}
    </ul>
  );
}
