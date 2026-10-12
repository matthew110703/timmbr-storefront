export const strings = {
  metadata: {
    title: "timmbr | Products",
    description: "Product Catalog & Artisan Goods",
  },
  appName: "Products",
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
