import type { Listing, ListingProduct } from "@/lib/api/types";

/** A product card as core's listing returns it. */
export const product = (
  i: number,
  overrides: Partial<ListingProduct> = {},
): ListingProduct => ({
  id: `p${i}`,
  slug: `product-${i}`,
  title: `Product ${i}`,
  brandName: "Oakline",
  price: 10000 + i,
  compareAtPrice: null,
  currency: "INR",
  discountPct: 0,
  hasMultipleVariants: false,
  inStock: true,
  defaultVariantId: `v${i}`,
  coverImage: {
    url: `https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/p${i}.jpg`,
    alt: null,
  },
  ...overrides,
});

/** A category listing (Living Room) with teak selected and a price range applied. */
export const listingFixture = (overrides: Partial<Listing> = {}): Listing => ({
  category: {
    id: "c-living",
    name: "Living Room",
    slug: "living-room",
    description: null,
    breadcrumb: [{ name: "Living Room", slug: "living-room" }],
    children: [{ name: "Sofas", slug: "sofas", logoUrl: null }],
  },
  products: [
    product(1),
    product(2, { inStock: false, hasMultipleVariants: true }),
  ],
  total: 30,
  page: 1,
  limit: 24,
  totalPages: 2,
  facets: [
    {
      key: "clearance",
      label: "Clearance Sale",
      displayType: "TOGGLE",
      options: [{ value: "yes", label: "Yes", count: 3, selected: false }],
      truncated: false,
    },
    {
      key: "material",
      label: "Material",
      displayType: "CHECKBOX",
      options: [
        { value: "teak-wood", label: "Teak Wood", count: 9, selected: true },
        { value: "oak-wood", label: "Oak Wood", count: 0, selected: false },
      ],
      truncated: false,
    },
    {
      key: "finish",
      label: "Finish",
      displayType: "SWATCH",
      options: [
        {
          value: "walnut-finish",
          label: "Walnut Finish",
          swatchHex: "#5C3A21",
          count: 4,
          selected: false,
        },
      ],
      truncated: false,
    },
  ],
  price: { min: 6000, max: 100000, step: 2000, selectedMin: 10000 },
  applied: {
    filters: "material:teak-wood",
    priceMin: 10000,
    sort: "relevance",
  },
  ...overrides,
});
