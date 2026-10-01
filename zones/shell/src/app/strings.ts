export const strings = {
  metadata: {
    title: "timmbr | Multi-Zone Storefront Shell",
    description:
      "High-performance Next.js 16 Multi-Zone Architecture with App Router, Turbopack, and Ingress Control Plane.",
  },
  navigation: {
    brand: "timmbr",
    badge: "Shell · Port 3000",
    healthProbe: "Health Probe",
    nextDocs: "Next.js 16",
  },
  hero: {
    pill: "Ingress Control Plane Online · Port 3000",
    title: "Storefront Shell",
    titleAccent: "@timmbr Platform",
    description:
      "The central domain control plane and ingress router. Built with Next.js 16 App Router, Turbopack, and automatic HTTP reverse proxying for downstream multi-zone applications.",
    ctaProbe: "⚡ Check Liveness Probe",
  },
  controlPlaneCard: {
    tag: "Active Ingress Host",
    name: "Shell Control Plane",
    path: "/",
    description:
      "Domain root host orchestrating routing, global layout, edge security headers, and health probes. Downstream multi-zone applications are mapped sequentially starting at port 3001.",
    portLabel: "Port:",
    portValue: "3000",
    nextAppsLabel: "Next Apps:",
    nextAppsValue: "3001, 3002...",
    bundlerLabel: "Bundler:",
    bundlerValue: "Turbopack",
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
  footer: {
    copyrightSuffix: "@timmbr platform. Native Multi-Zone Ingress (Port 3000).",
  },
} as const;

export type ShellStrings = typeof strings;
