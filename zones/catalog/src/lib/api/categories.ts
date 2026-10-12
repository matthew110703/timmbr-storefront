import { safeApiCall } from "@timmbr/utils";
import { api } from "./client";
import type { CategoryTreeItem } from "./types";

/**
 * Active category tree from the roots, three levels deep (root → column →
 * link), for the header menu. Public, so no session cookie is read.
 */
export function getCategoryTree(): Promise<CategoryTreeItem[]> {
  return safeApiCall(
    () =>
      api.get<CategoryTreeItem[]>("/categories/tree", {
        params: { depth: 3 },
        skipAuth: true,
        next: { revalidate: 600, tags: ["categories"] },
      }),
    [],
    "[API:getCategoryTree]",
  );
}
