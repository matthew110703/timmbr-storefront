export const strings = {
  metadata: {
    title: "timmbr",
    description: "Welcome to timmbr",
  },
  appName: "timmbr",
  loading: {
    message: "Crafting sanctuary...",
  },
  notFound: {
    title: "Sanctuary Not Found",
    description:
      "The page or collection you are looking for does not exist in this zone.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected issue occurred while rendering the home page.",
    retry: "Try Again",
  },
  footer: {
    copyright: "timmbr Inc. All rights reserved.",
  },
} as const;

export type HomeStrings = typeof strings;
