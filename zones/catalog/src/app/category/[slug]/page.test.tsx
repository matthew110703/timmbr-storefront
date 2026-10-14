import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { listingFixture } from "@/test/listing-fixtures";
import type { ListingResult } from "@/lib/api/listing";

const getListing = vi.fn<(query: unknown) => Promise<ListingResult>>();
vi.mock("@/lib/api/listing", () => ({
  getListing: (query: unknown) => getListing(query),
}));
// The banner streams from the CMS in its own boundary; covered by its own test path.
vi.mock("@/components/Listing/ListingBanner", () => ({
  ListingBanner: () => null,
  ListingBannerSkeleton: () => null,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const { default: CategoryPage, generateMetadata } = await import("./page");
const props = (searchParams: Record<string, string> = {}) => ({
  params: Promise.resolve({ slug: "living-room" }),
  searchParams: Promise.resolve(searchParams),
});

describe("Category page", () => {
  afterEach(() => getListing.mockReset());

  it("renders the category listing from one core request", async () => {
    getListing.mockResolvedValue({ status: "ok", listing: listingFixture() });
    render(
      await CategoryPage(props({ material: "teak-wood", utm_source: "x" })),
    );

    expect(getListing).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "living-room",
        filters: "material:teak-wood",
      }),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Living Room" }),
    ).toBeInTheDocument();
    expect(screen.getByText("30 items")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveTextContent("Home");
    expect(screen.getByRole("link", { name: "Sofas" })).toHaveAttribute(
      "href",
      "/category/sofas",
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Product 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Product 2" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    const chips = screen.getByText("Teak Wood", {
      selector: "[data-slot=filter-chips] *",
    });
    expect(chips).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Pagination" })).getByRole(
        "link",
        { name: "2" },
      ),
    ).toHaveAttribute(
      "href",
      "/category/living-room?material=teak-wood&page=2&price=10000-",
    );
  });

  it("shows a way back when nothing matches", async () => {
    getListing.mockResolvedValue({
      status: "ok",
      listing: listingFixture({ products: [], total: 0, totalPages: 0 }),
    });
    render(await CategoryPage(props({ material: "teak-wood" })));
    expect(
      screen.getByText("No products match these filters"),
    ).toBeInTheDocument();
  });

  it("404s for an unknown category or a page past the end", async () => {
    getListing.mockResolvedValue({ status: "not-found" });
    await expect(CategoryPage(props())).rejects.toThrow("NEXT_NOT_FOUND");

    getListing.mockResolvedValue({
      status: "ok",
      listing: listingFixture({ page: 5, totalPages: 2 }),
    });
    await expect(CategoryPage(props({ page: "5" }))).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("canonicalises to the clean path and keeps narrowed pages out of the index", async () => {
    getListing.mockResolvedValue({ status: "ok", listing: listingFixture() });
    const narrowed = await generateMetadata(props({ material: "teak-wood" }));
    expect(narrowed.alternates?.canonical).toBe("/category/living-room");
    expect(narrowed.robots).toEqual({ index: false, follow: true });

    getListing.mockResolvedValue({
      status: "ok",
      listing: listingFixture({
        page: 2,
        applied: { filters: "", sort: "relevance" },
      }),
    });
    const page2 = await generateMetadata(props({ page: "2" }));
    expect(page2.alternates?.canonical).toBe("/category/living-room?page=2");
    expect(page2.robots).toBeUndefined();
    expect(page2.title).toBe("Living Room | timmbr");
  });
});
