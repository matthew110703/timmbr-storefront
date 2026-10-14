import { describe, expect, it } from "vitest";
import type { ProductDetail, ProductVariant } from "@/lib/api/types";
import {
  optionImages,
  optionStates,
  productJsonLd,
  resolveVariant,
  selectOption,
  variantHref,
  variantImages,
  variantLabel,
} from "./product";

const variant = (
  id: string,
  options: Record<string, string>,
  stock: ProductVariant["stock"] = "IN_STOCK",
): ProductVariant => ({
  id,
  sku: id.toUpperCase(),
  price: 24999,
  compareAtPrice: null,
  discountPct: 0,
  currency: "INR",
  isDefault: id === "oat-boucle",
  options,
  stock,
  available: stock === "OUT_OF_STOCK" ? 0 : 5,
});

// The Koto chair: colour × upholstery, where olive only comes in velvet.
const product: ProductDetail = {
  id: "p1",
  slug: "koto-chair",
  title: "Koto Chair",
  shortDescription: "A curved accent chair.",
  description: null,
  brand: { name: "Oakline", slug: "oakline" },
  breadcrumb: [{ name: "Chairs", slug: "chairs" }],
  categorySlug: "chairs",
  images: [
    { url: "/hero.jpg", alt: "Koto", variantId: null },
    { url: "/charcoal.jpg", alt: "Charcoal", variantId: "char-boucle" },
  ],
  optionGroups: [
    {
      key: "color",
      name: "Colour",
      display: "PILL",
      options: [
        { value: "oatmeal", label: "Oatmeal", swatchHex: null },
        { value: "charcoal", label: "Charcoal", swatchHex: null },
        { value: "olive", label: "Olive", swatchHex: null },
      ],
    },
    {
      key: "upholstery",
      name: "Upholstery",
      display: "PILL",
      options: [
        { value: "boucle", label: "Bouclé", swatchHex: null },
        { value: "velvet", label: "Velvet", swatchHex: null },
      ],
    },
  ],
  variants: [
    variant("oat-boucle", { color: "oatmeal", upholstery: "boucle" }),
    variant(
      "char-boucle",
      { color: "charcoal", upholstery: "boucle" },
      "OUT_OF_STOCK",
    ),
    variant("olive-velvet", { color: "olive", upholstery: "velvet" }),
  ],
  defaultVariantId: "oat-boucle",
  specs: [],
  flags: { fastDelivery: false, clearance: false },
};

const byId = (id: string) => product.variants.find((v) => v.id === id)!;

describe("resolveVariant", () => {
  it("is the default variant without (valid) options in the URL", () => {
    expect(resolveVariant(product, {}).id).toBe("oat-boucle");
    expect(resolveVariant(product, { color: "purple", utm: "x" }).id).toBe(
      "oat-boucle",
    );
  });

  it("matches the URL's options, and the closest variant for partial ones", () => {
    expect(
      resolveVariant(product, { color: "olive", upholstery: "velvet" }).id,
    ).toBe("olive-velvet");
    expect(resolveVariant(product, { upholstery: "velvet" }).id).toBe(
      "olive-velvet",
    );
    expect(resolveVariant(product, { color: ["charcoal", "olive"] }).id).toBe(
      "char-boucle",
    );
  });
});

describe("selectOption", () => {
  it("keeps the other options when that combination exists", () => {
    expect(
      selectOption(product, byId("oat-boucle"), "color", "charcoal").id,
    ).toBe("char-boucle");
  });

  it("switches the other options when it doesn't, so every option stays reachable", () => {
    expect(selectOption(product, byId("oat-boucle"), "color", "olive").id).toBe(
      "olive-velvet",
    );
    expect(
      selectOption(product, byId("oat-boucle"), "upholstery", "velvet").id,
    ).toBe("olive-velvet");
  });
});

describe("optionStates", () => {
  it("marks what picking each option would lead to", () => {
    expect(optionStates(product, byId("oat-boucle"), "color")).toEqual({
      oatmeal: "available",
      charcoal: "out-of-stock",
      olive: "available",
    });
  });
});

describe("images, links and labels", () => {
  it("shows the variant's own images first, then the shared ones; all of them without its own", () => {
    expect(variantImages(product, "char-boucle").map((i) => i.url)).toEqual([
      "/charcoal.jpg",
      "/hero.jpg",
    ]);
    expect(variantImages(product, "oat-boucle").map((i) => i.url)).toEqual([
      "/hero.jpg",
      "/charcoal.jpg",
    ]);
  });

  it("gives photo tiles only when every option of the group has a photo", () => {
    expect(optionImages(product, "color")).toBeNull();
    const withPhotos = {
      ...product,
      images: [
        ...product.images,
        { url: "/oat.jpg", alt: "Oatmeal", variantId: "oat-boucle" },
        { url: "/olive.jpg", alt: "Olive", variantId: "olive-velvet" },
      ],
    };
    expect(optionImages(withPhotos, "color")).toEqual({
      oatmeal: "/oat.jpg",
      charcoal: "/charcoal.jpg",
      olive: "/olive.jpg",
    });
  });

  it("links the default variant to the clean URL and others with their options", () => {
    expect(variantHref(product, byId("oat-boucle"))).toBe(
      "/products/koto-chair",
    );
    expect(variantHref(product, byId("olive-velvet"))).toBe(
      "/products/koto-chair?color=olive&upholstery=velvet",
    );
    expect(variantLabel(product, byId("olive-velvet"))).toBe("Olive / Velvet");
  });
});

describe("productJsonLd", () => {
  it("describes a ProductGroup with an offer per variant, and the breadcrumb", () => {
    const [group, breadcrumb] = productJsonLd(
      product,
      "https://shop.test",
    ) as unknown as [
      Record<string, unknown> & { hasVariant: Record<string, any>[] },
      Record<string, unknown> & { itemListElement: unknown[] },
    ];
    expect(group).toMatchObject({
      "@type": "ProductGroup",
      productGroupID: "p1",
      variesBy: ["Colour", "Upholstery"],
      brand: { "@type": "Brand", name: "Oakline" },
    });
    expect(group.hasVariant).toHaveLength(3);
    expect(group.hasVariant[1]).toMatchObject({
      sku: "CHAR-BOUCLE",
      name: "Koto Chair (Charcoal / Bouclé)",
      offers: {
        price: 24999,
        priceCurrency: "INR",
        availability: "https://schema.org/OutOfStock",
        url: "https://shop.test/products/koto-chair?color=charcoal&upholstery=boucle",
      },
    });
    expect(breadcrumb.itemListElement).toHaveLength(2);
  });
});
