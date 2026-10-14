import { cache } from "react";
import { isApiError } from "@timmbr/utils";
import { api } from "./client";
import type { ProductDetail } from "./types";

export type ProductResult =
  { status: "ok"; product: ProductDetail } | { status: "not-found" };

/**
 * One product page payload: images, option groups, every variant's price and stock, specs and
 * the breadcrumb. `no-store`: core caches it in Redis (a minute), so the page never stacks a
 * second, separately-expiring copy. React `cache` dedupes the call between `generateMetadata`
 * and the page.
 */
export const getProduct = cache(
  async (slug: string): Promise<ProductResult> => {
    try {
      const product = await api.get<ProductDetail>(
        `/catalog/products/${encodeURIComponent(slug)}`,
        { skipAuth: true, cache: "no-store" },
      );
      return { status: "ok", product };
    } catch (error) {
      if (isApiError(error) && error.statusCode === 404)
        return { status: "not-found" };
      throw error;
    }
  },
);
