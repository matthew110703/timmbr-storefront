import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, Outfit } from "next/font/google";
import { TimmbrConfigProvider, Container } from "@timmbr/ui";
import { AuthModalHost } from "@timmbr/auth";
import { Header } from "@/components/Header";
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
          <Header />
          {/* Vertical page padding: the DS Container has no paddingY option yet. */}
          <Container asChild maxWidth="2xl" className="py-6 lg:py-10">
            <main>{children}</main>
          </Container>
          {/* Session + sign-in modal, shared with every zone via @timmbr/auth */}
          <AuthModalHost />
        </TimmbrConfigProvider>
      </body>
    </html>
  );
}
