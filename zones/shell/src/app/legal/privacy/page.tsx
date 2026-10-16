import type { Metadata } from "next";
import { getPageBySlug, isLegalContentSection } from "@/lib/api";
import { LegalContent } from "@/components/LegalContent";
import { env } from "@/env";
import { strings, FALLBACK_PRIVACY_CONTENT } from "./strings";

const canonicalUrl = `${env.STOREFRONT_URL}/legal/privacy`;

export const metadata: Metadata = {
  title: strings.metadata.title,
  description: strings.metadata.description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    siteName: "Timmbr",
    title: strings.metadata.title,
    description: strings.metadata.description,
    url: canonicalUrl,
  },
  twitter: {
    card: "summary",
    title: strings.metadata.title,
    description: strings.metadata.description,
  },
};

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("legal-privacy");
  const section = page?.sections?.find(isLegalContentSection);
  const data = section ?? FALLBACK_PRIVACY_CONTENT;

  return <LegalContent data={data} />;
}
