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
      popularTitle: "Popular Searches",
      popularTags: [
        { label: "Dining Tables", href: "/products?q=dining+table" },
        { label: "Teak Chairs", href: "/products?q=teak+chair" },
        { label: "Solid Wood Beds", href: "/products?q=solid+wood+bed" },
        { label: "Outdoor Loungers", href: "/products?q=outdoor+lounger" },
        { label: "Artisan Benches", href: "/products?q=bench" },
      ],
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
  loading: {
    message: "Loading...",
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
