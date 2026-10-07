export const strings = {
  metadata: {
    title: "timmbr | Products",
    description: "Product Catalog & Artisan Goods",
  },
  appName: "Products",
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
        { label: "Dining Tables", href: "/products?category=dining-room" },
        { label: "Teak Chairs", href: "/products?category=living-room" },
        { label: "Solid Wood Beds", href: "/products?category=bedroom" },
        { label: "Outdoor Loungers", href: "/products?category=outdoor" },
        { label: "Artisan Benches", href: "/products?category=collections" },
      ],
    },
    navItems: [
      {
        id: "living-room",
        label: "Living Room",
        href: "/products?category=living-room",
      },
      {
        id: "dining-room",
        label: "Dining Room",
        href: "/products?category=dining-room",
      },
      {
        id: "bedroom",
        label: "Bedroom",
        href: "/products?category=bedroom",
      },
      {
        id: "outdoor",
        label: "Outdoor",
        href: "/products?category=outdoor",
      },
      {
        id: "collections",
        label: "Collections",
        href: "/products?category=collections",
      },
    ],
    actions: {
      // Profile labels (LOGIN / first name) come from @timmbr/auth.
      account: {
        href: "/account",
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
    description: "The requested products page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the products zone.",
    retry: "Try Again",
  },
} as const;

export type ProductsStrings = typeof strings;
