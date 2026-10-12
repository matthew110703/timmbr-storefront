/** Top-level paths served by the catalog zone (see next.config rewrites). */
const CATALOG_PREFIXES = ["/products", "/category"];

/**
 * True when `href` points into the catalog zone, so links to it need a full
 * navigation (a plain <a>) instead of next/link.
 */
export function isCatalogHref(href: string) {
  const path = href.split(/[?#]/)[0];
  return CATALOG_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
