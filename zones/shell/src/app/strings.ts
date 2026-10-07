export const strings = {
  metadata: {
    title: "timmbr - Solid Wood Furniture & Artisan Living",
    description:
      "Handcrafted solid wood furniture, dining tables, seating, and bespoke home collections built to last generations.",
  },
  appName: "timmbr",
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
  hero: {
    eyebrow: "New Arrivals · Spring",
    title: "Furniture with roots",
    description:
      "Grown well, finished slowly, kept for life. Solid-wood pieces made by hand in our Portland workshop.",
    primaryCta: {
      label: "Shop the collection",
      path: "/products",
    },
    secondaryCta: {
      label: "Explore living",
      path: "/products",
    },
    bannerAlt: "Handcrafted solid wood furniture living space",
  },
  perksAndOffers: {
    title: "Perks and Offers",
    discount: {
      prefix: "FLAT",
      symbol: "₹",
      value: 9000,
      suffix: "OFF",
      label: "On Your 1st Purchase",
    },
  },
  exploreCategories: {
    title: "Explore Categories",
    viewAll: "View All Categories",
  },
  trending: {
    title: "Trending",
    description: "Discover the pieces everyone’s loving",
    shopNow: "Shop Now",
  },
  consultation: {
    title: "Not sure where to start? Book a designer.",
    eyebrow: "Design services",
    description:
      "Consultation with a Timmbr interior designer. We'll plan your room, suggest pieces you can shop.",
    cta: {
      label: "Book a free consultation",
      path: "/consultation",
    },
    bannerAlt: "Timmbr interior design consultation living room",
  },
  footer: {
    tagline:
      "Handcrafted solid wood furniture built with precision, finished slowly, and made to last generations.",
    office: {
      title: "Registered Office:",
      address:
        "Timmbr Furnitures, SABN Kallappa Layout, Ashwini Extension, Chintamani, Karnataka 563125",
    },
    sections: [
      {
        id: "shop",
        title: "Shop",
        items: [
          { id: "sofas", label: "Sofa's", href: "/products?category=sofas" },
          {
            id: "living",
            label: "Living",
            href: "/products?category=living-room",
          },
          {
            id: "bedroom",
            label: "Bedroom",
            href: "/products?category=bedroom",
          },
          { id: "office", label: "Office", href: "/products?category=office" },
          {
            id: "dining",
            label: "Dining",
            href: "/products?category=dining-room",
          },
        ],
      },
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
    pill: "404 · Route Not Found",
    title: "Page Not Found",
    description: "The requested URL was not found on this platform.",
    ctaHome: "Return to Home",
  },
  globalError: {
    title: "Global Application Error",
    fallbackMessage:
      "An unexpected error occurred in the shell ingress runtime.",
    retryButton: "Try Again",
  },
  auth: {
    banner: {
      title: "FRESH",
      subtitle: "Arrivals August",
      promoBadge: "UPTO 20% OFF",
      termsNotice: "*T&C Apply",
    },
  },
} as const;

export type ShellStrings = typeof strings;
