import { describe, it, expect } from "vitest";
import { isCatalogHref } from "./zones";

describe("isCatalogHref", () => {
  it.each([
    "/products",
    "/products/teak-chair",
    "/products?q=sofa",
    "/category/sofas",
  ])("matches catalog path %s", (href) =>
    expect(isCatalogHref(href)).toBe(true),
  );

  it.each([
    "/",
    "/account",
    "/checkout",
    "/productsale",
    "/categoryx",
    "/craft/materials",
  ])("does not match %s", (href) => expect(isCatalogHref(href)).toBe(false));
});
