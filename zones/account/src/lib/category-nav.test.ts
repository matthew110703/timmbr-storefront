import { describe, it, expect } from "vitest";
import {
  NAV_LINKS_PER_GROUP,
  NAV_ROOT_LIMIT,
  toCategoryMenus,
  toFooterLinks,
  toMenuGroups,
  toMenuTiles,
  toNavTree,
  type CategoryNavNode,
} from "./category-nav";

const copy = { viewAll: (name: string) => `All ${name}`, viewMore: "View all" };

const node = (slug: string, children?: CategoryNavNode[]): CategoryNavNode => ({
  id: slug,
  name: slug.toUpperCase(),
  slug,
  children,
});

const living = node("living", [
  node("sofas", [node("3-seater"), node("2-seater")]),
  node("benches"),
  node(
    "tables",
    Array.from({ length: 10 }, (_, i) => node(`table-${i}`)),
  ),
]);

const hrefs = (group: { links?: { href: string }[] }) =>
  group.links?.map((l) => l.href);

describe("category nav rules", () => {
  it("shows at most NAV_ROOT_LIMIT roots, in tree order", () => {
    const tree = Array.from({ length: 8 }, (_, i) => node(`root-${i}`));
    const menus = toCategoryMenus(tree, copy);
    expect(menus.map((m) => m.id)).toEqual(
      tree.slice(0, NAV_ROOT_LIMIT).map((n) => n.id),
    );
    expect(toFooterLinks(tree)).toHaveLength(NAV_ROOT_LIMIT);
  });

  it("gives every root a menu, even without children ('All {root}' only)", () => {
    const [menu] = toCategoryMenus([node("outdoor")], copy);
    expect(menu.groups).toEqual([
      {
        id: "outdoor",
        title: "OUTDOOR",
        links: [
          { id: "outdoor", label: "All OUTDOOR", href: "/category/outdoor" },
        ],
      },
    ]);
    expect(menu.tiles?.map((t) => t.label)).toEqual(["All OUTDOOR"]);
  });

  it("starts with the root group, then one group per child with children", () => {
    const groups = toMenuGroups(living, copy);
    expect(groups.map((g) => g.title)).toEqual(["LIVING", "SOFAS", "TABLES"]);
    // Root group: "All {root}" then the childless children
    expect(hrefs(groups[0])).toEqual(["/category/living", "/category/benches"]);
    // Child group: "All {child}" first, then its children; headings aren't links
    expect(groups[1].href).toBeUndefined();
    expect(groups[1].links?.[0]).toMatchObject({
      label: "All SOFAS",
      href: "/category/sofas",
    });
    expect(hrefs(groups[1])?.slice(1)).toEqual([
      "/category/3-seater",
      "/category/2-seater",
    ]);
  });

  it("caps long groups with a 'View all' link", () => {
    const tables = toMenuGroups(living, copy)[2];
    expect(tables.links).toHaveLength(NAV_LINKS_PER_GROUP + 1); // + "All TABLES"
    expect(tables.more).toEqual({
      label: "View all",
      href: "/category/tables",
    });
  });

  it("builds mobile tiles: 'All {root}' first, then each child with its image", () => {
    const withImages: CategoryNavNode = {
      ...living,
      children: living.children?.map((c, i) => ({
        ...c,
        logoUrl: i === 1 ? null : `/${c.slug}.jpg`,
      })),
    };
    const tiles = toMenuTiles(withImages, copy);
    expect(tiles.map((t) => t.label)).toEqual([
      "All LIVING",
      "SOFAS",
      "BENCHES",
      "TABLES",
    ]);
    expect(tiles[0]).toMatchObject({
      href: "/category/living",
      imageSrc: "/sofas.jpg",
    });
    expect(tiles[2].imageSrc).toBeNull();
  });

  it("trims the tree to the shown roots and the fields the menus use", () => {
    const extra = {
      status: "ACTIVE",
      description: "long text",
      parentId: null,
    };
    const tree = Array.from({ length: 7 }, (_, i) => ({
      ...node(`root-${i}`, [{ ...node(`child-${i}`), ...extra }]),
      ...extra,
    }));
    const trimmed = toNavTree(tree);
    expect(trimmed).toHaveLength(NAV_ROOT_LIMIT);
    expect(trimmed[0]).toEqual({
      id: "root-0",
      name: "ROOT-0",
      slug: "root-0",
      logoUrl: null,
      children: [
        {
          id: "child-0",
          name: "CHILD-0",
          slug: "child-0",
          logoUrl: null,
          children: [],
        },
      ],
    });
  });

  it("builds footer links from the root slugs", () => {
    expect(toFooterLinks([living])).toEqual([
      { id: "living", label: "LIVING", href: "/category/living" },
    ]);
  });
});
