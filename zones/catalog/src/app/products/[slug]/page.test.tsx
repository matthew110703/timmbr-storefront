import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BED } from "@/components/Product/fixtures";

const api = vi.hoisted(() => ({ getProduct: vi.fn(), getPdpTrust: vi.fn() }));
vi.mock("@/lib/api/product", () => ({ getProduct: api.getProduct }));
vi.mock("@/lib/api/cms", () => ({ getPdpTrust: api.getPdpTrust }));
vi.mock("@/lib/api/browser", () => ({
  cartApi: { add: vi.fn() },
  wishlistApi: { check: vi.fn(), add: vi.fn(), remove: vi.fn() },
}));
// Async server component: covered by its own behaviour, stubbed here.
vi.mock("@/components/Product/SimilarProducts", () => ({
  SimilarProducts: () => null,
  SimilarProductsSkeleton: () => null,
}));
vi.mock("@timmbr/auth", () => ({
  useSession: () => ({ status: "anonymous", user: null }),
  openAuthModal: vi.fn(),
  setCartLines: vi.fn(),
  bumpCartCount: vi.fn(),
  useCartQuantity: () => 0,
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import ProductPage, { generateMetadata } from "./page";

const props = (query: Record<string, string> = {}) => ({
  params: Promise.resolve({ slug: BED.slug }),
  searchParams: Promise.resolve(query),
});

describe("Product page", () => {
  afterEach(() => vi.clearAllMocks());

  it("is a 404 for an unknown product", async () => {
    api.getProduct.mockResolvedValue({ status: "not-found" });
    api.getPdpTrust.mockResolvedValue(null);
    await expect(ProductPage(props())).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("opens the variant the URL asks for, with breadcrumb and structured data", async () => {
    api.getProduct.mockResolvedValue({ status: "ok", product: BED });
    api.getPdpTrust.mockResolvedValue({
      type: "pdp-trust",
      items: [{ icon: "emi", label: "No-cost EMI" }],
    });

    const { container } = render(await ProductPage(props({ finish: "honey" })));

    expect(screen.getByText(/Product ID: SKU-HONEY/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Beds" })).toHaveAttribute(
      "href",
      "/category/beds",
    );
    expect(screen.getByText("No-cost EMI")).toBeInTheDocument();
    const jsonLd = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!
        .textContent!,
    );
    expect(jsonLd[0]).toMatchObject({
      "@type": "ProductGroup",
      name: "Hale Teak Bed",
    });
  });

  it("falls back to built-in trust copy without the CMS section", async () => {
    api.getProduct.mockResolvedValue({ status: "ok", product: BED });
    api.getPdpTrust.mockResolvedValue(null);
    render(await ProductPage(props()));
    expect(screen.getByText("60 months warranty*")).toBeInTheDocument();
  });

  it("titles the page after the product, with one canonical URL for all variants", async () => {
    api.getProduct.mockResolvedValue({ status: "ok", product: BED });
    const metadata = await generateMetadata(props({ finish: "honey" }));
    expect(metadata).toMatchObject({
      title: "Hale Teak Bed | timmbr",
      description: "A solid teak bed.",
      alternates: { canonical: "/products/hale-teak-bed" },
    });
  });
});
