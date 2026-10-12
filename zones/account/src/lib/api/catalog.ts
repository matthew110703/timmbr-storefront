import { safeApiCall } from "@timmbr/utils";
import { api } from "@/lib/api/client";
import type { CategoryTreeItem } from "@/lib/api/types";

/**
 * Public catalog reads for the account zone's chrome. Unlike `serverGet`,
 * these skip the session and are cached.
 */

/** Active category tree, three levels deep, for the header menu. */
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
