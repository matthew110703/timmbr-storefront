export const strings = {
  metadata: {
    title: "timmbr | Checkout",
    description: "Dedicated Order Checkout & Confirmation",
  },
  appName: "Checkout",
  loading: {
    message: "Loading...",
  },
  notFound: {
    title: "Page Not Found",
    description: "The requested checkout page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the checkout zone.",
    retry: "Try Again",
  },
} as const;

export type CheckoutStrings = typeof strings;
