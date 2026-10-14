import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { listingFixture } from "@/test/listing-fixtures";
import type { ListingResult } from "@/lib/api/listing";

const getListing = vi.fn<(query: unknown) => Promise<ListingResult>>();
vi.mock("@/lib/api/listing", () => ({
  getListing: (query: unknown) => getListing(query),
}));
vi.mock("@/components/Listing/ListingBanner", () => ({
  ListingBanner: () => null,
  ListingBannerSkeleton: () => null,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  notFound: vi.fn(),
}));

const { default: ProductsPage } = await import("./page");

describe("Products page", () => {
  it("lists all products, titled by the search when there is one", async () => {
    getListing.mockResolvedValue({
      status: "ok",
      listing: listingFixture({
        category: null,
        applied: { filters: "", sort: "relevance", q: "teak bed" },
      }),
    });
    render(
      await ProductsPage({ searchParams: Promise.resolve({ q: "teak bed" }) }),
    );

    expect(getListing).toHaveBeenCalledWith(
      expect.objectContaining({ category: undefined, q: "teak bed" }),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Results for “teak bed”" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveTextContent("All products");
  });
});
