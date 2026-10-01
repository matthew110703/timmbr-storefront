export const strings = {
  metadata: {
    title: "timmbr | Artisan Craftsmanship & Modern Living",
    description:
      "Explore handcrafted solid-wood furniture, sustainable architectural home goods, and bespoke interior elements built to last generations.",
  },
  navigation: {
    brand: "timmbr",
    badge: "Home · Port 3001",
    tagline: "Artisan Woodcraft & Architectural Goods",
    catalogLink: "Catalog",
    collectionsLink: "Collections",
    craftsmanshipLink: "Our Craft",
    aboutLink: "About Us",
    ingressLink: "Shell Ingress",
  },
  hero: {
    badge: "New Autumn Collection 2026",
    headline: "Pure Solid Wood Crafted for",
    headlineAccent: "Timeless Spaces",
    subhead:
      "Handcrafted architectural furniture designed with natural walnut, oak, and brass accents. Thoughtfully sculpted, sustainably harvested, and engineered for generations of living.",
    primaryCta: "Explore Collections",
    secondaryCta: "Our Craftsmanship",
  },
  valueProps: {
    sustainability: {
      title: "100% FSC® Certified",
      description:
        "Sustainably harvested hardwoods from certified ethical forests.",
    },
    joinery: {
      title: "Traditional Joinery",
      description:
        "Mortise-and-tenon and dovetail joinery built with zero shortcuts.",
    },
    finishes: {
      title: "Natural Organic Oils",
      description:
        "Zero-VOC, food-safe plant oils that age with a warm, rich patina.",
    },
    warranty: {
      title: "Lifetime Guarantee",
      description:
        "Every piece is designed to be cherished, handed down, and repaired.",
    },
  },
  featuredCategories: {
    eyebrow: "Curated Rooms",
    title: "Furnish Every Sanctuary",
    description:
      "Explore purposeful silhouettes and textured organic finishes tailored for modern living.",
    categories: [
      {
        id: "dining",
        name: "Dining Tables",
        tag: "Centerpieces",
        description:
          "Solid American walnut dining tables with soft-bevel edges.",
        itemCount: "12 Designs",
      },
      {
        id: "seating",
        name: "Chairs & Benches",
        tag: "Ergonomics",
        description:
          "Sculpted seats with organic curves and concealed joinery.",
        itemCount: "18 Models",
      },
      {
        id: "storage",
        name: "Credenzas & Storage",
        tag: "Architectural",
        description:
          "Slatted acoustic doors with precision soft-closing dampers.",
        itemCount: "9 Pieces",
      },
      {
        id: "lighting",
        name: "Wood & Brass Lights",
        tag: "Atmosphere",
        description:
          "Turned oak pendants and hand-rubbed unlacquered brass accents.",
        itemCount: "14 Lights",
      },
    ],
  },
  featuredProducts: {
    eyebrow: "Signature Editions",
    title: "Crafted for Everyday Life",
    description:
      "Our most celebrated silhouettes, hand-finished in our artisan workshop.",
    viewAll: "View Complete Catalog",
    products: [
      {
        id: "kanso-dining-table",
        name: "Kanso Dining Table",
        category: "Dining",
        wood: "Black Walnut",
        price: "$2,450",
        tag: "Bestseller",
        badgeVariant: "brand" as const,
      },
      {
        id: "nord-lounge-chair",
        name: "Nord Lounge Chair",
        category: "Seating",
        wood: "White Oak",
        price: "$1,180",
        tag: "New Release",
        badgeVariant: "primary" as const,
      },
      {
        id: "mori-credenza",
        name: "Mori Slatted Credenza",
        category: "Storage",
        wood: "American Cherry",
        price: "$3,200",
        tag: "Handcrafted",
        badgeVariant: "subtle" as const,
      },
    ],
  },
  zoneBadge: {
    zoneName: "Zone: home",
    portLabel: "Port 3001",
    isolatedRuntime: "Turbopack Independent Runtime",
  },
  footer: {
    copyright: "timmbr Inc. All rights reserved. Artisan Craftsmanship.",
    disclaimer:
      "Running on Timmbr Multi-Zone Architecture (Home Zone · Port 3001).",
  },
} as const;

export type HomeStrings = typeof strings;
