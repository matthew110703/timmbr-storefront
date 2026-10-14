export const strings = {
  metadata: {
    title: "timmbr | Products",
    description: "Product Catalog & Artisan Goods",
  },
  branding: {
    logoAlt: "timmbr - Solid Wood Furniture",
    miniLogoAlt: "timmbr leaf icon",
  },
  header: {
    search: {
      placeholder:
        "Search solid wood furniture, collections, artisanal pieces...",
      ariaLabel: "Search products",
      recentTitle: "Recent searches",
      clearRecent: "Clear",
      removeRecent: (query: string) => `Remove “${query}” from recent searches`,
      resultsTitle: "Products",
      noResults: "No products match",
      seeAll: (query: string) => `See all results for “${query}”`,
    },
    /** Category menu copy; the categories themselves come from timmbr-core. */
    categoryNav: {
      viewAll: (name: string) => `All ${name}`,
      viewMore: "View all",
    },
    actions: {
      // Profile labels (LOGIN / first name) come from @timmbr/auth.
      account: {
        href: "/account",
        /** Signed-in menu (desktop); "Log out" is added by @timmbr/auth. */
        menu: [
          { id: "orders", label: "My orders", href: "/account/orders" },
          { id: "account", label: "Your account", href: "/account/security" },
        ],
      },
      wishlist: {
        label: "WISH LIST",
        ariaLabel: "Wishlist",
        href: "/account/wishlist",
      },
      cart: {
        label: "CART",
        ariaLabel: "Shopping Cart",
        href: "/checkout",
      },
    },
  },
  /** Listing pages (/products, /category/<slug>). Categories and filters come from timmbr-core. */
  listing: {
    allProducts: "All products",
    searchTitle: (q: string) => `Results for “${q}”`,
    home: "Home",
    breadcrumb: "Breadcrumb",
    total: (n: number) =>
      `${n.toLocaleString("en-IN")} ${n === 1 ? "item" : "items"}`,
    sortBy: "Sort by",
    sorts: {
      relevance: "Recommended",
      newest: "Newest",
      price_asc: "Price: low to high",
      price_desc: "Price: high to low",
      discount: "Biggest discount",
    },
    filters: {
      title: "Filters",
      price: "Price range",
      apply: "Apply",
      reset: "Reset",
      clear: "Clear",
      clearAll: "Clear all",
      showLess: "Show less",
      showMore: (hidden: number) => `Show more (${hidden})`,
      searchPlaceholder: (group: string) => `Search ${group.toLowerCase()}`,
      noMatches: "No matches",
      thumbMin: "Minimum price",
      thumbMax: "Maximum price",
      quickFilters: "Quick filters",
      close: "Close filters",
      open: (n: number) => (n > 0 ? `Filter (${n})` : "Filter"),
      showResults: (n: number | null) =>
        n === null
          ? "Show results"
          : `Show ${n.toLocaleString("en-IN")} ${n === 1 ? "result" : "results"}`,
      removeChip: (label: string) => `Remove ${label}`,
    },
    card: {
      options: "1+ Options",
      outOfStock: "Out of stock",
      wishlist: {
        add: (title: string) => `Save ${title} to wishlist`,
        remove: (title: string) => `Remove ${title} from wishlist`,
        added: "Saved to your wishlist",
        removed: "Removed from your wishlist",
        failed: "Couldn't update your wishlist. Please try again.",
      },
    },
    empty: {
      title: "No products match these filters",
      description:
        "Remove a filter below, or clear them all to see everything here.",
      activeFilters: "Active filters",
      removeFilter: (label: string) => `Remove filter: ${label}`,
      clearAll: "Clear all filters",
      browseAll: "Browse all products",
      exploreParent: (name: string) => `Explore ${name}`,
      noSearchResults: (q: string) => `No results for “${q}”`,
      searchTips:
        "Check the spelling, try fewer or more general words, or browse the collection.",
      searchWithFilters:
        "Nothing matches your search with these filters. Remove a filter below, or clear them.",
      clearSearch: "Clear search",
      emptyCategory: "Nothing here yet",
      emptyCategoryDescription: (name?: string) =>
        name
          ? `We're still crafting pieces for ${name}. In the meantime, explore the rest of the collection.`
          : "New pieces are on their way. In the meantime, explore the rest of the collection.",
    },
    pagination: {
      label: "Pagination",
      previous: "Previous",
      next: "Next",
      summary: (from: number, to: number, total: number) =>
        `Showing ${from}–${to} of ${total.toLocaleString("en-IN")}`,
    },
    /** Used when the CMS banner is missing or unreachable. */
    banner: {
      title: "Crafted for comfort. Designed to belong.",
      description:
        "Timeless solid-wood furniture, thoughtfully crafted for the moments that matter.",
      imageUrl:
        "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/hero.png",
      imageAlt: "A sunlit living room with solid-wood furniture",
      badges: [
        { label: "Solid wood, built to last" },
        { label: "Premium fabrics, made for comfort" },
        { label: "Timeless designs for every home" },
      ],
    },
  },
  /** Same footer as the shell's (each zone owns its copy). */
  footer: {
    tagline:
      "Handcrafted solid wood furniture built with precision, finished slowly, and made to last generations.",
    office: {
      title: "Registered Office:",
      address:
        "Timmbr Furnitures, SABN Kallappa Layout, Ashwini Extension, Chintamani, Karnataka 563125",
    },
    /** First section: the header's root categories (from timmbr-core). */
    shopTitle: "Shop",
    sections: [
      {
        id: "craft",
        title: "Craft",
        items: [
          { id: "materials", label: "Our materials", href: "/craft/materials" },
          { id: "workshop", label: "The workshop", href: "/craft/workshop" },
          {
            id: "sustainability",
            label: "Sustainability",
            href: "/craft/sustainability",
          },
          { id: "care", label: "Care guide", href: "/craft/care-guide" },
        ],
      },
      {
        id: "help",
        title: "Help",
        items: [
          { id: "contact", label: "Contact us", href: "/help/contact" },
          {
            id: "shipping",
            label: "Shipping & delivery",
            href: "/help/shipping",
          },
          {
            id: "warranty",
            label: "Warranty & returns",
            href: "/help/warranty",
          },
          { id: "trade", label: "Trade & commercial", href: "/help/trade" },
        ],
      },
    ],
    socialTitle: "Follow Us",
    copyright: "© 2026 Timmbr Furniture Co. All rights reserved.",
    legalLinks: [
      { id: "privacy", label: "Privacy policy", href: "/legal/privacy" },
      { id: "terms", label: "Terms of service", href: "/legal/terms" },
      { id: "cookies", label: "Cookie preferences", href: "/legal/cookies" },
    ],
  },
  notFound: {
    title: "Page Not Found",
    description: "The requested page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the catalog.",
    retry: "Try Again",
  },
} as const;

export type CatalogStrings = typeof strings;
