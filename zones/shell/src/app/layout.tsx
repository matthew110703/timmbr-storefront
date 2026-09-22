import type { Metadata } from "next";
import "./globals.css";
import { strings } from "./strings";

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
    <html lang="en">
      <body>
        <div className="bg-mesh" aria-hidden="true" />
        <div className="content-wrapper">
          <header className="navbar">
            <div className="nav-brand">
              <span>{strings.navigation.brand}</span>
              <span className="brand-badge">{strings.navigation.badge}</span>
            </div>
            <nav className="nav-links">
              <a href="/health" target="_blank" className="nav-link">
                {strings.navigation.healthProbe}
              </a>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-cta"
              >
                {strings.navigation.nextDocs}
              </a>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="footer">
            <p>
              © {new Date().getFullYear()} {strings.footer.copyrightSuffix}
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
