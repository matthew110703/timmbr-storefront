import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, Outfit } from "next/font/google";
import { TimmbrConfigProvider, Container } from "@timmbr/ui";
import "./globals.css";
import { strings } from "./strings";
import { AuthModalHost } from "@timmbr/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategoryTree } from "@/lib/api/categories";
import { toNavTree } from "@/lib/category-nav";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Header menu: cached, and [] if core is unreachable.
  const categories = toNavTree(await getCategoryTree());

  return (
    <html
      lang="en"
      data-theme="light"
      style={{ colorScheme: "light" }}
      className={`${manrope.variable} ${dmSerif.variable} ${outfit.variable}`}
    >
      <body>
        <TimmbrConfigProvider config={{ theme: { mode: "light" } }}>
          <Header categories={categories} />
          {/* Same width as the header, so content and header edges line up. */}
          <Container asChild maxWidth="2xl">
            <main>{children}</main>
          </Container>
          <Footer categories={categories} />
          {/* Session + sign-in modal, shared with every zone via @timmbr/auth */}
          <AuthModalHost />
        </TimmbrConfigProvider>
      </body>
    </html>
  );
}
