/**
 * timmbr-core response shapes used by the catalog zone (data inside the
 * `{ success, data }` envelope). Mirrors core's DTOs; keep in sync.
 */

/** A node of `GET /categories/tree` (active categories, sorted by name). */
export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  parentId?: string | null;
  children?: CategoryTreeItem[];
}
