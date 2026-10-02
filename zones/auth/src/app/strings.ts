export const strings = {
  metadata: {
    title: "timmbr | Auth",
    description: "Authentication and Account Management",
  },
  appName: "Auth",
  loading: {
    message: "Loading...",
  },
  notFound: {
    title: "Page Not Found",
    description: "The requested auth page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the authentication zone.",
    retry: "Try Again",
  },
} as const;

export type AuthStrings = typeof strings;
