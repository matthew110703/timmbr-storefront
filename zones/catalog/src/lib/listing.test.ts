import { describe, expect, it } from "vitest";
import { listingFixture } from "@/test/listing-fixtures";
import {
  activeChips,
  formatPrice,
  isNarrowed,
  listingHref,
  parseListingUrl,
  stateFromListing,
  toFilterGroups,
  toListingQuery,
} from "./listing";

describe("listing URL mapping", () => {
  it("parses the page URL and builds core's request (filters as one parameter)", () => {
    const state = parseListingUrl({
      material: "walnut-wood,teak-wood",
      size: "king-size",
      price: "10000-50000",
      sort: "price_asc",
      page: "2",
      utm_source: "newsletter",
    });
    expect(toListingQuery(state, "beds")).toEqual({
      category: "beds",
      filters: "material:teak-wood,walnut-wood;size:king-size",
      priceMin: 10000,
      priceMax: 50000,
      sort: "price_asc",
      page: 2,
      q: undefined,
    });
  });

  it("renders from what core applied, not from the raw URL", () => {
    const state = stateFromListing(listingFixture());
    expect(state).toEqual({
      filters: { material: ["teak-wood"] },
      priceMin: 10000,
      page: 1,
    });
    expect(listingHref("/category/living-room", state)).toBe(
      "/category/living-room?material=teak-wood&price=10000-",
    );
  });

  it("gives the clean path for the default state", () => {
    expect(listingHref("/products", { filters: {}, page: 1 })).toBe(
      "/products",
    );
  });

  it("knows which states narrow the results", () => {
    expect(isNarrowed({ filters: {}, page: 3, sort: "newest" })).toBe(false);
    expect(isNarrowed({ filters: {}, page: 1, q: "oak" })).toBe(true);
    expect(isNarrowed({ filters: { a: ["b"] }, page: 1 })).toBe(true);
    expect(isNarrowed({ filters: {}, page: 1, priceMax: 5 })).toBe(true);
  });
});

describe("toFilterGroups", () => {
  it("maps display types and takes the selection from the (draft) state", () => {
    const groups = toFilterGroups(listingFixture().facets, {
      filters: { material: ["oak-wood"], clearance: ["yes"] },
      page: 1,
    });
    expect(groups.map((g) => [g.key, g.display])).toEqual([
      ["clearance", "toggle"],
      ["material", "checkbox"],
      ["finish", "swatch"],
    ]);
    expect(
      groups[1].options.map((o) => [o.value, o.selected, o.count]),
    ).toEqual([
      ["teak-wood", false, 9],
      ["oak-wood", true, 0],
    ]);
    expect(groups[2].options[0].swatch).toBe("#5C3A21");
  });
});

describe("activeChips", () => {
  it("labels values from the facets, toggles by their group, and the price range", () => {
    const { facets } = listingFixture();
    const chips = activeChips(
      {
        filters: { material: ["teak-wood"], clearance: ["yes"], gone: ["x"] },
        priceMin: 10000,
        page: 1,
      },
      facets,
    );
    expect(chips.map((c) => [c.id, c.label])).toEqual([
      ["material:teak-wood", "Teak Wood"],
      ["clearance:yes", "Clearance Sale"],
      ["gone:x", "x"],
      ["price", `${formatPrice(10000)}+`],
    ]);
    expect(chips[0].action).toEqual({
      type: "toggle",
      key: "material",
      value: "teak-wood",
    });
    expect(chips[3].action).toEqual({ type: "clearPrice" });
  });

  it("puts the search first, removable on its own", () => {
    const [chip] = activeChips(
      { filters: { material: ["teak-wood"] }, page: 1, q: "teak bed" },
      [],
    );
    expect(chip).toMatchObject({
      id: "q",
      label: "“teak bed”",
      action: { type: "setQuery" },
    });
  });

  it("formats bounded and upper-only price ranges", () => {
    expect(
      activeChips(
        { filters: {}, priceMin: 1000, priceMax: 5000, page: 1 },
        [],
      )[0].label,
    ).toBe("₹1,000 – ₹5,000");
    expect(
      activeChips({ filters: {}, priceMax: 5000, page: 1 }, [])[0].label,
    ).toBe("Up to ₹5,000");
  });
});
