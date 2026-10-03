import type { CategoryItem } from "@/lib/api/types";
import { MOCK_CATEGORY_IMAGES } from "@/app/mock";

/**
 * Returns a high-quality category image URL for a given slug or logoUrl.
 */
export function getCategoryImage(category: CategoryItem): string {
  if (category.logoUrl && category.logoUrl.trim().length > 0) {
    return category.logoUrl;
  }

  const slugKey = category.slug?.toLowerCase() || "";

  if (MOCK_CATEGORY_IMAGES[slugKey]) {
    return MOCK_CATEGORY_IMAGES[slugKey];
  }

  // Partial matches
  for (const [key, url] of Object.entries(MOCK_CATEGORY_IMAGES)) {
    if (key !== "default" && slugKey.includes(key)) {
      return url;
    }
  }

  return MOCK_CATEGORY_IMAGES.default || MOCK_CATEGORY_IMAGES.sofas;
}
