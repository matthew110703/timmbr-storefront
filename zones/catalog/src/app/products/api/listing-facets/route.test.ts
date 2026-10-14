import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { listingFixture } from "@/test/listing-fixtures";

const getListingFacets = vi.fn();
vi.mock("@/lib/api/listing", () => ({
  getListingFacets: (...args: unknown[]) => getListingFacets(...args),
}));

const { GET } = await import("./route");
const request = (query: string) =>
  new NextRequest(`http://localhost/products/api/listing-facets?${query}`);

describe("GET /products/api/listing-facets", () => {
  afterEach(() => getListingFacets.mockReset());

  it("forwards the staged selection to core (page 1) and caches at the edge", async () => {
    const { total, facets, price, applied } = listingFixture();
    getListingFacets.mockResolvedValue({ total, facets, price, applied });

    const response = await GET(
      request(
        "category=beds&material=teak-wood,oak-wood&price=1000-&page=4&junk_key=1",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("s-maxage=30");
    expect(getListingFacets).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "beds",
        filters: "material:oak-wood,teak-wood",
        priceMin: 1000,
        page: 1,
      }),
    );
    expect((await response.json()).total).toBe(total);
  });

  it("rejects an invalid category", async () => {
    const response = await GET(request("category=Bad%20Slug"));
    expect(response.status).toBe(400);
    expect(getListingFacets).not.toHaveBeenCalled();
  });

  it("answers 502 without caching when core fails", async () => {
    getListingFacets.mockRejectedValue(new Error("down"));
    const response = await GET(request("category=beds"));
    expect(response.status).toBe(502);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
