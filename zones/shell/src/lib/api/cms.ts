import { api } from "./client";
import type { PageResponse } from "./types";
import { safeApiCall, type RequestOptions } from "@timmbr/utils";

/**
 * Fetches page content and CMS sections by slug with ISR caching and safe error fallback.
 *
 * @param slug - The page slug (e.g. "landing-page", "about", "craftsmanship")
 * @param options - Optional Next.js request/caching overrides
 * @returns The page response object or null if unavailable
 */
export async function getPageBySlug(
  slug: string,
  options?: RequestOptions,
): Promise<PageResponse | null> {
  return safeApiCall(
    () =>
      api.get<PageResponse>(`/pages/${slug}`, {
        next: {
          revalidate: 60,
          tags: ["page", `page-${slug}`],
        },
        ...options,
      }),
    null,
    `[CMS:getPageBySlug("${slug}")]`,
  );
}
