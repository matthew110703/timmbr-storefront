import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ListingState } from "@timmbr/utils";
import type { Listing } from "@/lib/api/types";
import { EmptyListing } from "./EmptyListing";

const listing = {
  category: null,
  products: [],
  total: 0,
  page: 1,
  limit: 24,
  totalPages: 0,
  facets: [
    {
      key: "material",
      label: "Material",
      displayType: "CHECKBOX",
      truncated: false,
      options: [{ value: "teak", label: "Teak", count: 0, selected: true }],
    },
  ],
  price: { min: 0, max: 0, step: 0 },
  applied: { filters: "", sort: "relevance" },
} as unknown as Listing;

const renderEmpty = (state: ListingState) =>
  render(<EmptyListing listing={listing} state={state} basePath="/products" />);

describe("EmptyListing", () => {
  it("explains a search with no matches and offers the whole collection", () => {
    renderEmpty({ filters: {}, page: 1, q: "zebra" });

    expect(
      screen.getByRole("heading", { name: "No results for “zebra”" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/check the spelling/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse all products" }),
    ).toHaveAttribute("href", "/products");
  });

  it("lets a filtered search drop a filter, all filters, or the search", () => {
    renderEmpty({ filters: { material: ["teak"] }, page: 1, q: "bed" });

    expect(
      screen.getByRole("link", { name: "Remove filter: Teak" }),
    ).toHaveAttribute("href", "/products?q=bed");
    expect(
      screen.getByRole("link", { name: "Clear all filters" }),
    ).toHaveAttribute("href", "/products?q=bed");
    expect(screen.getByRole("link", { name: "Clear search" })).toHaveAttribute(
      "href",
      "/products?material=teak",
    );
    // The search itself isn't offered as a chip here: it's in the title.
    expect(
      screen.queryByRole("link", { name: /“bed”/ }),
    ).not.toBeInTheDocument();
  });

  it("keeps the filtered-out message when there is no search", () => {
    renderEmpty({ filters: { material: ["teak"] }, page: 1 });
    expect(
      screen.getByRole("heading", { name: "No products match these filters" }),
    ).toBeInTheDocument();
  });
});
