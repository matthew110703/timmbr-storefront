import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, Outfit } from "next/font/google";
import {
  TimmbrConfigProvider,
  Container,
  Inline,
  Stack,
  Badge,
  Button,
  Text,
} from "@timmbr/ui";
import "./globals.css";
import { strings } from "./strings";

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: strings.metadata.title,
  description: strings.metadata.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      style={{ colorScheme: "light" }}
      className={`${manrope.variable} ${dmSerif.variable} ${outfit.variable}`}
    >
      <body>
        <TimmbrConfigProvider config={{ theme: { mode: "light" } }}>
          <div className="min-h-screen flex flex-col justify-between">
            {/* Top Navigation Bar */}
            <header className="border-b border-grey-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
              <Container maxWidth="xl" padded>
                <Inline justify="between" align="center" className="py-4">
                  <Inline gap={4} align="center">
                    <a href="/home" className="inline-flex items-center gap-2">
                      <span className="font-serif text-2xl font-bold tracking-tight text-grey-1000">
                        {strings.navigation.brand}
                      </span>
                    </a>
                    <Badge variant="brand" size="sm" dot>
                      {strings.navigation.badge}
                    </Badge>
                  </Inline>

                  <nav>
                    <Inline gap={3} align="center">
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/home#categories">
                          {strings.navigation.catalogLink}
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/home#featured">
                          {strings.navigation.collectionsLink}
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/home#craft">
                          {strings.navigation.craftsmanshipLink}
                        </a>
                      </Button>
                      {/* Cross-zone navigation across zone boundaries */}
                      <Button variant="outline" size="sm" asChild>
                        {}
                        <a href="/">{strings.navigation.ingressLink}</a>
                      </Button>
                    </Inline>
                  </nav>
                </Inline>
              </Container>
            </header>

            {/* Main Application Container */}
            <main className="flex-1">{children}</main>

            {/* Storefront Footer */}
            <footer className="border-t border-grey-200 py-10 bg-white/60">
              <Container maxWidth="xl" padded>
                <Stack gap={4} align="center" className="text-center">
                  <Inline gap={2} align="center">
                    <span className="font-serif text-xl font-bold text-grey-900">
                      {strings.navigation.brand}
                    </span>
                    <Text variant="body-3" foreground="muted">
                      · {strings.navigation.tagline}
                    </Text>
                  </Inline>
                  <Text variant="body-3" foreground="muted">
                    © {new Date().getFullYear()} {strings.footer.copyright}
                  </Text>
                  <Text variant="body-3" foreground="subtle">
                    {strings.footer.disclaimer}
                  </Text>
                </Stack>
              </Container>
            </footer>
          </div>
        </TimmbrConfigProvider>
      </body>
    </html>
  );
}
