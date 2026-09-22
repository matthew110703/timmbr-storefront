import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display, Manrope, Outfit } from "next/font/google";
import {
  TimmbrConfigProvider,
  Container,
  Inline,
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
            <header className="border-b border-grey-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
              <Container maxWidth="lg" padded>
                <Inline justify="between" align="center" className="py-4">
                  <Inline gap={3} align="center">
                    <Link href="/" className="inline-flex items-center">
                      <Image
                        src="/timmbr-logo.png"
                        alt={strings.navigation.brand}
                        width={124}
                        height={31}
                        priority
                        className="h-8 w-auto object-contain"
                      />
                    </Link>
                    <Badge variant="subtle" size="sm">
                      {strings.navigation.badge}
                    </Badge>
                  </Inline>
                  <nav>
                    <Inline gap={3} align="center">
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/health" target="_blank">
                          {strings.navigation.healthProbe}
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://nextjs.org/docs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {strings.navigation.nextDocs}
                        </a>
                      </Button>
                    </Inline>
                  </nav>
                </Inline>
              </Container>
            </header>

            <main className="flex-1 py-12">{children}</main>

            <footer className="border-t border-grey-200 py-8 text-center bg-white/40">
              <Container maxWidth="lg">
                <Text variant="body-3" foreground="muted">
                  © {new Date().getFullYear()} {strings.footer.copyrightSuffix}
                </Text>
              </Container>
            </footer>
          </div>
        </TimmbrConfigProvider>
      </body>
    </html>
  );
}
