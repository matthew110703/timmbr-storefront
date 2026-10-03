import { api } from "./client";
import type { ProductItem } from "./types";
import { safeApiCall, type RequestOptions } from "@timmbr/utils";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  productIds?: string | string[];
  ids?: string | string[];
  categoryId?: string;
}

/**
 * Fetches products list with optional pagination, productIds, and category filters.
 *
 * @param params - Query parameters (page, limit, productIds, ids, categoryId)
 * @param options - Optional Next.js request/caching overrides
 * @returns Array of product items
 */
export async function getProducts(
  params: GetProductsParams = {},
  options?: RequestOptions,
): Promise<ProductItem[]> {
  const { page, limit, productIds, ids, categoryId } = params;
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));

  const filterIds = productIds || ids;
  if (filterIds) {
    const idsString = Array.isArray(filterIds)
      ? filterIds.join(",")
      : filterIds;
    query.set("productIds", idsString);
  }

  if (categoryId) {
    query.set("categoryId", categoryId);
  }

  const endpoint = `/products${query.toString() ? `?${query.toString()}` : ""}`;

  return safeApiCall(
    () =>
      api.get<ProductItem[]>(endpoint, {
        next: {
          revalidate: 120,
          tags: ["products"],
        },
        ...options,
      }),
    [],
    "[API:getProducts]",
  );
}
