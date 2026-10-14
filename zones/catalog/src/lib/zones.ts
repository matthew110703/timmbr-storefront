/** Top-level paths served by this (catalog) zone (see the shell's next.config rewrites). */
const CATALOG_PREFIXES = ["/products", "/category"];

/**
 * True when `href` stays inside the catalog zone (client-side navigation with next/link);
 * anything else (/, /craft, /account…) is another zone and needs a full page load.
 */
export function isCatalogHref(href: string) {
  const path = href.split(/[?#]/)[0];
  return CATALOG_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
