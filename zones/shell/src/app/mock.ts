import type {
  CategoryItem,
  FeaturedBanner,
  ProductItem,
  PerkItem,
} from "@/lib/api/types";

/**
 * Temporary mock & fallback datasets for development and offline mode.
 * Centralized here to keep strings.ts pure and allow easy cleanup when backend endpoints are active.
 */

export const MOCK_PERKS: PerkItem[] = [
  {
    label: "Expert Consultation",
    iconUrl:
      "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/consultation.png",
  },
  {
    label: "Free Delivery",
    iconUrl:
      "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/delivery.png",
  },
  {
    label: "5-Year Warranty",
    iconUrl:
      "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/warranty.png",
  },
];

export const MOCK_CATEGORY_IMAGES: Record<string, string> = {
  sofas:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  "living-room":
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  "living-room-luxury":
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  bedroom:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  kitchen:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  office:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  "dining-room":
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
};

export const MOCK_FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-sofas",
    name: "SOFAS",
    slug: "sofas",
    logoUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-living",
    name: "LIVING",
    slug: "living-room",
    logoUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-bedroom",
    name: "BEDROOM",
    slug: "bedroom",
    logoUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-office",
    name: "OFFICE",
    slug: "office",
    logoUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-kitchen",
    name: "KITCHEN",
    slug: "kitchen",
    logoUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  },
];

export const MOCK_DEFAULT_BANNERS: FeaturedBanner[] = [
  {
    title: "Empire Collection",
    imageUrl:
      "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/empire-collection.png",
    cta: {
      primary: {
        path: "/products",
        label: "Shop Now",
      },
    },
  },
  {
    title: "Vita Amalfi",
    imageUrl:
      "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/vita-amalfi.png",
    cta: {
      primary: {
        path: "/products",
        label: "Shop Now",
      },
    },
  },
];

export const MOCK_FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";

export const MOCK_FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: "9276ebfd-b178-4982-a298-475c6f66b402",
    title: "Nordic Teak 3-Seater Minimalist Sofa",
    slug: "nordic-teak-3-seater-minimalist-sofa",
    price: 48999,
    compareAtPrice: 59999,
    currency: "INR",
    coverImage: {
      url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      altText: "Nordic Teak 3-Seater Minimalist Sofa",
    },
  },
  {
    id: "a271b960-e049-4b20-91c6-52b30784b78b",
    title: "Oak Dining Table",
    slug: "oak-dining-table",
    price: 39999,
    compareAtPrice: 45999,
    currency: "INR",
    coverImage: {
      url: "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/products/a271b960-e049-4b20-91c6-52b30784b78b/images/706f295d-ec1b-43cb-9603-b2497e7964c1.webp",
      altText: "Solid wood dining chair front",
    },
  },
];

export const MOCK_DEFAULT_HERO_BANNER =
  "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/hero.png";

export const MOCK_DEFAULT_CONSULTATION_BANNER =
  "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms/consult.png";
