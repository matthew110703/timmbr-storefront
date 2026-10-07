export const strings = {
  metadata: {
    title: "timmbr | Account",
    description: "User Profile, Order History, Addresses & Settings",
  },
  appName: "Account",
  account: {
    greeting: (name: string) =>
      `Hello, ${name.trim().split(/\s+/)[0] || "there"}`,
    logout: "Log out",
  },
  loading: {
    message: "Loading...",
  },
  notFound: {
    title: "Page Not Found",
    description: "The requested account page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the account zone.",
    retry: "Try Again",
  },
} as const;

export type AccountStrings = typeof strings;
