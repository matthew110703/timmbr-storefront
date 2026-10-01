import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, Outfit } from "next/font/google";
import { TimmbrConfigProvider, Container, Text } from "@timmbr/ui";
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
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>

            <footer className="border-t border-grey-200 py-6 text-center bg-white/40">
              <Container maxWidth="xl" padded>
                <Text variant="body-3" foreground="muted">
                  © {new Date().getFullYear()} {strings.footer.copyright}
                </Text>
              </Container>
            </footer>
          </div>
        </TimmbrConfigProvider>
      </body>
    </html>
  );
}
