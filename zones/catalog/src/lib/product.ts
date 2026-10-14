import type { OptionPickerState } from "@timmbr/ui";
import type { ProductDetail, ProductVariant } from "@/lib/api/types";

/**
 * Product page logic, framework-free: which variant a URL means, what each option would lead
 * to, which images to show and the structured data. Variants carry their option values, so the
 * page resolves everything without asking the server again.
 */

export type Selection = Record<string, string>;
type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const inStock = (variant: ProductVariant) => variant.stock !== "OUT_OF_STOCK";

/** The URL's valid option values (`?finish=walnut`); unknown keys and values are ignored. */
export function selectionFromParams(
  product: ProductDetail,
  params: SearchParams,
): Selection {
  const selection: Selection = {};
  for (const group of product.optionGroups) {
    const value = first(params[group.key]);
    if (value && group.options.some((option) => option.value === value)) {
      selection[group.key] = value;
    }
  }
  return selection;
}

/**
 * The variant that best matches `selection`: the most matching options wins; ties go to an
 * in-stock variant, then to core's order (default variant first). An empty selection gives the
 * default variant.
 */
export function bestVariant(
  product: ProductDetail,
  selection: Selection,
  candidates: ProductVariant[] = product.variants,
): ProductVariant {
  let best = candidates[0];
  let bestScore = -1;
  for (const variant of candidates) {
    const matches = Object.entries(selection).filter(
      ([key, value]) => variant.options[key] === value,
    ).length;
    const score = matches * 2 + (inStock(variant) ? 1 : 0);
    if (score > bestScore) {
      best = variant;
      bestScore = score;
    }
  }
  return best ?? product.variants[0];
}

/** The variant a page URL asks for (the default one when it asks for nothing valid). */
export function resolveVariant(
  product: ProductDetail,
  params: SearchParams,
): ProductVariant {
  const selection = selectionFromParams(product, params);
  if (Object.keys(selection).length === 0) {
    return (
      product.variants.find((v) => v.id === product.defaultVariantId) ??
      product.variants[0]
    );
  }
  return bestVariant(product, selection);
}

/**
 * The variant after picking `value` for `key`: keeps as many of the other current options as a
 * real variant allows (picking a finish that doesn't come in the current size switches the
 * size too), so every option stays reachable.
 */
export function selectOption(
  product: ProductDetail,
  current: ProductVariant,
  key: string,
  value: string,
): ProductVariant {
  const candidates = product.variants.filter((v) => v.options[key] === value);
  if (candidates.length === 0) return current;
  return bestVariant(product, { ...current.options, [key]: value }, candidates);
}

/**
 * What picking each option of a group would give, with the other options as they are:
 * `available`, or `out-of-stock` when that combination is sold out. Options that only exist
 * with other choices are shown by what they'd switch to (see selectOption), never disabled.
 */
export function optionStates(
  product: ProductDetail,
  current: ProductVariant,
  key: string,
): Record<string, OptionPickerState> {
  const states: Record<string, OptionPickerState> = {};
  const group = product.optionGroups.find((g) => g.key === key);
  for (const option of group?.options ?? []) {
    const target = selectOption(product, current, key, option.value);
    states[option.value] = inStock(target) ? "available" : "out-of-stock";
  }
  return states;
}

/**
 * Images for a variant: its own photos first, then the product's shared ones (other variants'
 * photos left out). A variant without photos of its own shows every image, so it's never
 * reduced to one or two shared shots.
 */
export function variantImages(
  product: ProductDetail,
  variantId: string,
): ProductDetail["images"] {
  const own = product.images.filter((image) => image.variantId === variantId);
  if (own.length === 0) return product.images;
  const shared = product.images.filter((image) => image.variantId === null);
  return [...own, ...shared];
}

/**
 * A photo per option of a group (the first image of a variant with that option), or null when
 * some option has none: photo tiles only make sense when every option has one.
 */
export function optionImages(
  product: ProductDetail,
  key: string,
): Record<string, string> | null {
  const group = product.optionGroups.find((g) => g.key === key);
  if (!group) return null;
  const images: Record<string, string> = {};
  for (const option of group.options) {
    const variantIds = new Set(
      product.variants
        .filter((v) => v.options[key] === option.value)
        .map((v) => v.id),
    );
    const image = product.images.find(
      (i) => i.variantId !== null && variantIds.has(i.variantId),
    );
    if (!image) return null;
    images[option.value] = image.url;
  }
  return images;
}

/** Page URL of a variant: the clean URL for the default one, option params otherwise. */
export function variantHref(product: ProductDetail, variant: ProductVariant) {
  const path = `/products/${product.slug}`;
  if (variant.id === product.defaultVariantId) return path;
  const params = new URLSearchParams();
  for (const group of product.optionGroups) {
    const value = variant.options[group.key];
    if (value) params.set(group.key, value);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/** "Walnut / King": the variant's option labels, in group order. */
export function variantLabel(product: ProductDetail, variant: ProductVariant) {
  return product.optionGroups
    .map(
      (group) =>
        group.options.find((o) => o.value === variant.options[group.key])
          ?.label,
    )
    .filter(Boolean)
    .join(" / ");
}

const AVAILABILITY: Record<ProductVariant["stock"], string> = {
  IN_STOCK: "https://schema.org/InStock",
  LOW_STOCK: "https://schema.org/LimitedAvailability",
  OUT_OF_STOCK: "https://schema.org/OutOfStock",
};

/**
 * schema.org structured data: a ProductGroup with one Product (and Offer) per variant, as
 * Google documents for variants on one page, plus the breadcrumb.
 */
export function productJsonLd(product: ProductDetail, origin: string) {
  const url = `${origin}/products/${product.slug}`;
  const image = product.images.map((i) => i.url);
  const brand = product.brand && {
    "@type": "Brand",
    name: product.brand.name,
  };
  const variesBy = product.optionGroups.map((g) => g.name);
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      name: product.title,
      description: product.shortDescription,
      url,
      productGroupID: product.id,
      ...(image.length && { image }),
      ...(brand && { brand }),
      ...(variesBy.length && { variesBy }),
      hasVariant: product.variants.map((variant) => {
        const label = variantLabel(product, variant);
        return {
          "@type": "Product",
          sku: variant.sku,
          name: label ? `${product.title} (${label})` : product.title,
          ...(image.length && {
            image: variantImages(product, variant.id).map((i) => i.url),
          }),
          offers: {
            "@type": "Offer",
            url: `${origin}${variantHref(product, variant)}`,
            price: variant.price,
            priceCurrency: variant.currency,
            availability: AVAILABILITY[variant.stock],
            itemCondition: "https://schema.org/NewCondition",
          },
        };
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        ...product.breadcrumb.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${origin}/category/${crumb.slug}`,
        })),
        {
          "@type": "ListItem",
          position: product.breadcrumb.length + 1,
          name: product.title,
          item: url,
        },
      ],
    },
  ];
}
