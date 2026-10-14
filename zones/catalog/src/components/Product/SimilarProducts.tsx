import { strings } from "@/app/products/[slug]/strings";
import { getListing } from "@/lib/api/listing";
import { ProductRail } from "./ProductRail";

const MAX_ITEMS = 8;

/**
 * More from the product's own category (the listing endpoint, cached in core), without the
 * product itself. Nothing when the category has nothing else or the listing is unreachable:
 * a side rail must never break the page.
 */
export async function SimilarProducts({
  categorySlug,
  excludeId,
}: {
  categorySlug: string;
  excludeId: string;
}) {
  const result = await getListing({ category: categorySlug }).catch(() => null);
  if (!result || result.status !== "ok") return null;
  const products = result.listing.products
    .filter((product) => product.id !== excludeId)
    .slice(0, MAX_ITEMS);
  if (products.length === 0) return null;

  const copy = strings.card;
  return (
    <ProductRail
      title={strings.similar}
      products={products.map((product) => ({
        key: product.id,
        productId: product.id,
        variantId: product.defaultVariantId,
        title: product.title,
        href: `/products/${product.slug}`,
        image: product.coverImage?.url ?? null,
        imageAlt: product.coverImage?.alt ?? product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        currency: product.currency,
        badge: product.inStock ? undefined : copy.outOfStock,
        optionsLabel: product.hasMultipleVariants ? copy.options : undefined,
      }))}
    />
  );
}

/** Same height as the rail, so the page doesn't jump when it streams in. */
export function SimilarProductsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <div className="h-8 w-56 animate-pulse rounded-sm bg-grey-200" />
      <div className="flex gap-3 overflow-hidden sm:gap-5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="aspect-[171/220] w-[42%] shrink-0 animate-pulse rounded-sm bg-grey-200 sm:w-[30%] lg:w-[calc((100%-3.75rem)/4)]"
          />
        ))}
      </div>
    </div>
  );
}
