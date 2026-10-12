import { mapTree } from "@timmbr/utils";
import type { NavMenuData, NavMenuGroup, NavMenuTile } from "@timmbr/ui";

/**
 * Category menu rules for the storefront: which roots show, the category URL
 * scheme, "All {name}" links and caps. Plain data only; the DS renders it
 * (`toNavMenuItems` from @timmbr/ui).
 */

/** Roots shown in the header and footer (no ranking yet: the first by name). */
export const NAV_ROOT_LIMIT = 5;
/** Subcategory links under one heading before a "View all" link takes over. */
export const NAV_LINKS_PER_GROUP = 8;

/** The parts of core's category tree the menus need. */
export interface CategoryNavNode {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  children?: CategoryNavNode[];
}

export interface CategoryNavCopy {
  /** First link of a group, e.g. "All Sofas". */
  viewAll: (name: string) => string;
  /** Trailing link of a capped group. */
  viewMore: string;
}

export const categoryHref = (slug: string) => `/category/${slug}`;

const navRoots = <T>(tree: T[]) => tree.slice(0, NAV_ROOT_LIMIT);

const link = (node: CategoryNavNode, label = node.name) => ({
  id: node.id,
  label,
  href: categoryHref(node.slug),
});

/**
 * The shown roots with only the fields the menus use. Layouts call this on
 * the server so the client Header gets a small payload, not core's full tree.
 */
export function toNavTree(tree: CategoryNavNode[]): CategoryNavNode[] {
  return mapTree(navRoots(tree), (node, children: CategoryNavNode[]) => ({
    id: node.id,
    name: node.name,
    slug: node.slug,
    logoUrl: node.logoUrl ?? null,
    children,
  }));
}

/**
 * A root's desktop groups (Figma 105:108): a heading, then "All {name}" as the
 * first link, then the subcategories.
 * - First group: the root itself ("All {root}") plus its childless children.
 * - Then one group per child that has children of its own.
 */
export function toMenuGroups(
  root: CategoryNavNode,
  copy: CategoryNavCopy,
): NavMenuGroup[] {
  const children = root.children ?? [];
  const leaves = children.filter((child) => !child.children?.length);
  const branches = children.filter((child) => child.children?.length);

  const rootGroup: NavMenuGroup = {
    id: root.id,
    title: root.name,
    links: [
      link(root, copy.viewAll(root.name)),
      ...leaves.map((node) => link(node)),
    ],
  };

  const childGroups = branches.map((child): NavMenuGroup => {
    const grandchildren = child.children ?? [];
    return {
      id: child.id,
      title: child.name,
      links: [
        link(child, copy.viewAll(child.name)),
        ...grandchildren
          .slice(0, NAV_LINKS_PER_GROUP)
          .map((node) => link(node)),
      ],
      more:
        grandchildren.length > NAV_LINKS_PER_GROUP
          ? { label: copy.viewMore, href: categoryHref(child.slug) }
          : undefined,
    };
  });

  return [rootGroup, ...childGroups];
}

/**
 * A root's mobile tiles: "All {root}" first (the only way to the root page on
 * phones; it borrows the first child's image when the root has none), then
 * one tile per child.
 */
export function toMenuTiles(
  root: CategoryNavNode,
  copy: CategoryNavCopy,
): NavMenuTile[] {
  const children = root.children ?? [];
  return [
    {
      ...link(root, copy.viewAll(root.name)),
      imageSrc: root.logoUrl ?? children.find((c) => c.logoUrl)?.logoUrl,
    },
    ...children.map((child) => ({ ...link(child), imageSrc: child.logoUrl })),
  ];
}

/** Header menus: every shown root opens a menu (groups + mobile tiles). */
export function toCategoryMenus(
  tree: CategoryNavNode[],
  copy: CategoryNavCopy,
): NavMenuData[] {
  return navRoots(tree).map((root) => ({
    id: root.id,
    label: root.name,
    groups: toMenuGroups(root, copy),
    tiles: toMenuTiles(root, copy),
  }));
}

/** Footer links: the same roots as the header, as plain links. */
export function toFooterLinks(tree: CategoryNavNode[]) {
  return navRoots(tree).map((root) => link(root));
}
