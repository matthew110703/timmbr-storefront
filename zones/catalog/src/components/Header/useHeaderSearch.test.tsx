import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  RECENT_SEARCHES_KEY,
  searchHref,
  toSearchResult,
  useHeaderSearch,
} from "./useHeaderSearch";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const PRODUCT = {
  id: "p1",
  slug: "hale-teak-bed",
  title: "Hale Teak Bed",
  brandName: "Oakline",
  price: 32999,
  currency: "INR",
  coverImage: { url: "https://cdn.example/bed.jpg", alt: null },
};

describe("useHeaderSearch (catalog)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ products: [PRODUCT] }), {
          status: 200,
        }),
      ),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
    push.mockReset();
  });

  it("remembers a submitted search and opens its results in this zone", () => {
    const { result } = renderHook(() => useHeaderSearch());

    act(() => result.current.onSubmit?.("  teak bed "));

    expect(push).toHaveBeenCalledWith("/products?q=teak+bed");
    expect(
      JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY)!),
    ).toEqual(["teak bed"]);
    expect(result.current.recentSearches).toEqual(["teak bed"]);
  });

  it("ignores an empty submit", () => {
    const { result } = renderHook(() => useHeaderSearch());
    act(() => result.current.onSubmit?.("   "));
    expect(push).not.toHaveBeenCalled();
  });

  it("suggests products from the zone's suggest route once typing pauses", async () => {
    const { result } = renderHook(() => useHeaderSearch());

    act(() => result.current.onChange?.("Teak"));

    await waitFor(() => expect(result.current.results?.items).toHaveLength(1));
    expect(fetch).toHaveBeenCalledWith(
      "/products/api/search-suggest?q=teak",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.results?.items[0]).toMatchObject({
      href: "/products/hale-teak-bed",
      title: "Hale Teak Bed",
      subtitle: "Oakline",
    });
  });
});

describe("search helpers", () => {
  it("builds the results URL", () => {
    expect(searchHref("teak & oak")).toBe("/products?q=teak+%26+oak");
  });

  it("maps a suggested product to a header result (same-zone link)", () => {
    expect(toSearchResult(PRODUCT)).toEqual({
      id: "p1",
      href: "/products/hale-teak-bed",
      title: "Hale Teak Bed",
      subtitle: "Oakline",
      price: "₹32,999",
      imageUrl: "https://cdn.example/bed.jpg",
      imageAlt: "",
    });
  });
});
