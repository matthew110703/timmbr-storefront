import { api } from "./client";
import type { CategoryItem } from "./types";
import { safeApiCall, type RequestOptions } from "@timmbr/utils";

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  categoryIds?: string | string[];
  ids?: string | string[];
}

/**
 * Fetches categories list with optional pagination and categoryIds filter.
 *
 * @param params - Query parameters (page, limit, categoryIds, ids)
 * @param options - Optional Next.js request/caching overrides
 * @returns Array of category items
 */
export async function getCategories(
  params: GetCategoriesParams = {},
  options?: RequestOptions,
): Promise<CategoryItem[]> {
  const { page, limit, categoryIds, ids } = params;
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));

  const filterIds = categoryIds || ids;
  if (filterIds) {
    const idsString = Array.isArray(filterIds)
      ? filterIds.join(",")
      : filterIds;
    query.set("categoryIds", idsString);
  }

  const endpoint = `/categories${query.toString() ? `?${query.toString()}` : ""}`;

  return safeApiCall(
    () =>
      api.get<CategoryItem[]>(endpoint, {
        next: {
          revalidate: 120,
          tags: ["categories"],
        },
        ...options,
      }),
    [],
    "[API:getCategories]",
  );
}
