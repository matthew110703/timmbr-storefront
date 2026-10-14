import type { ProductDetail, ProductVariant } from "@/lib/api/types";

const variant = (
  id: string,
  finish: string,
  overrides: Partial<ProductVariant> = {},
): ProductVariant => ({
  id,
  sku: `SKU-${id.toUpperCase()}`,
  price: 32999,
  compareAtPrice: 63999,
  discountPct: 48,
  currency: "INR",
  isDefault: id === "walnut",
  options: { finish },
  stock: "IN_STOCK",
  available: 10,
  ...overrides,
});

/** A bed in three finishes: walnut (default), honey (2 left), white (sold out). */
export const BED: ProductDetail = {
  id: "p-bed",
  slug: "hale-teak-bed",
  title: "Hale Teak Bed",
  shortDescription: "A solid teak bed.",
  description: "Solid teak, built to last.",
  brand: { name: "Oakline", slug: "oakline" },
  breadcrumb: [
    { name: "Bedroom", slug: "bedroom" },
    { name: "Beds", slug: "beds" },
  ],
  categorySlug: "beds",
  images: [
    { url: "https://cdn.test/a.jpg", alt: "Front", variantId: null },
    { url: "https://cdn.test/b.jpg", alt: "Side", variantId: null },
  ],
  optionGroups: [
    {
      key: "finish",
      name: "Finish",
      display: "SWATCH",
      options: [
        { value: "walnut", label: "Walnut", swatchHex: "#5C3A21" },
        { value: "honey", label: "Honey", swatchHex: "#B5753A" },
        { value: "white", label: "White", swatchHex: "#F7F6F2" },
      ],
    },
  ],
  variants: [
    variant("walnut", "walnut"),
    variant("honey", "honey", {
      price: 34999,
      stock: "LOW_STOCK",
      available: 2,
    }),
    variant("white", "white", { stock: "OUT_OF_STOCK", available: 0 }),
  ],
  defaultVariantId: "walnut",
  specs: [{ label: "Material", value: "Teak Wood" }],
  flags: { fastDelivery: true, clearance: false },
};
