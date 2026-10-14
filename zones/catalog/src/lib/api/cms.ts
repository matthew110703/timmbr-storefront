import { safeApiCall } from "@timmbr/utils";
import { api } from "./client";
import type { PageResponse, PdpTrustSection, PlpBannerSection } from "./types";

/** CMS page holding the catalog pages' content (listings and product pages). */
const CATALOG_PAGE = "catalog";

/**
 * A section of the "catalog" CMS page, like the landing page's sections: cached for 5 minutes,
 * null when missing, hidden or unreachable (the page then falls back to its built-in copy).
 */
async function getCatalogSection<T extends { show?: boolean }>(
  type: string,
): Promise<T | null> {
  const page = await safeApiCall(
    () =>
      api.get<PageResponse>(`/pages/${CATALOG_PAGE}`, {
        skipAuth: true,
        next: { revalidate: 300, tags: ["page", `page-${CATALOG_PAGE}`] },
      }),
    null,
    `[CMS:${type}]`,
  );
  const section = page?.sections.find((s) => s.type === type) as T | undefined;
  return section && section.show !== false ? section : null;
}

/** The listing banner ("plp-banner"). */
export function getPlpBanner(): Promise<PlpBannerSection | null> {
  return getCatalogSection<PlpBannerSection>("plp-banner");
}

/** The product page promises under Add to cart ("pdp-trust"). */
export function getPdpTrust(): Promise<PdpTrustSection | null> {
  return getCatalogSection<PdpTrustSection>("pdp-trust");
}
