export const strings = {
  metadata: {
    title: "timmbr",
    description: "Storefront Shell",
  },
  appName: "timmbr",
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
} as const;

export type ShellStrings = typeof strings;
