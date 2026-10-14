import { describe, expect, it } from "vitest";
import {
  RECENT_SEARCHES_KEY,
  searchHref,
  toSearchResult,
} from "./useHeaderSearch";

describe("header search (shell)", () => {
  it("shares the recent-searches list with the other zones", () => {
    expect(RECENT_SEARCHES_KEY).toBe("timmbr:recent-searches:v1");
  });

  it("sends results and product pages to the catalog zone with a full page load", () => {
    expect(searchHref("teak bed")).toBe("/products?q=teak+bed");
    expect(
      toSearchResult({
        id: "p1",
        slug: "hale-teak-bed",
        title: "Hale Teak Bed",
        brandName: null,
        price: 32999.5,
        currency: "INR",
        coverImage: null,
      }),
    ).toEqual({
      id: "p1",
      href: "/products/hale-teak-bed",
      crossZone: true,
      title: "Hale Teak Bed",
      subtitle: undefined,
      price: "₹32,999.50",
      imageUrl: undefined,
      imageAlt: "",
    });
  });
});
