import * as React from "react";
import Image from "next/image";
import { strings } from "@/app/strings";
import { ASSETS } from "../../../public";
import { NavFooter } from "@timmbr/ui";

/**
 * Shell Footer Component (Server Component).
 * Directly consumes NavFooter from @timmbr/ui with centralized strings.
 */
export function Footer() {
  return (
    <NavFooter
      containerMaxWidth="2xl"
      branding={{
        logo: (
          <Image
            src={ASSETS.brandLogo}
            alt={strings.branding.logoAlt}
            width={140}
            height={34}
            className="h-8 w-auto object-contain"
          />
        ),
        description: strings.footer.tagline,
        href: "/",
        alt: strings.branding.logoAlt,
      }}
      navigation={{
        sections: strings.footer.sections.map((sec) => ({
          id: sec.id,
          title: sec.title,
          items: sec.items.map((item) => ({
            id: item.id,
            label: item.label,
            href: item.href,
            crossZone: item.href.startsWith("/products"),
          })),
        })),
      }}
      social={{
        title: strings.footer.socialTitle,
        links: [
          { name: "instagram", href: "https://instagram.com" },
          { name: "facebook", href: "https://facebook.com" },
          { name: "pinterest", href: "https://pinterest.com" },
          { name: "linkedin", href: "https://linkedin.com" },
        ],
      }}
      office={{
        title: strings.footer.office.title,
        address: strings.footer.office.address,
      }}
      legal={{
        copyright: strings.footer.copyright,
        links: strings.footer.legalLinks.map((link) => ({
          id: link.id,
          label: link.label,
          href: link.href,
        })),
      }}
    />
  );
}

export default Footer;
