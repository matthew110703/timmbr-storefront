"use client";

import Image from "next/image";
import Link from "next/link";
import { NavFooter } from "@timmbr/ui";
import { strings } from "@/app/strings";
import { toFooterLinks, type CategoryNavNode } from "@/lib/category-nav";
import { isCatalogHref } from "@/lib/zones";

// Public files live under the zone's assetPrefix (public/catalog-static/).
const BRAND_LOGO = "/catalog-static/timmbr-logo.png";

export interface FooterProps {
  /** Root categories for the "Shop" section (same as the header's). */
  categories?: CategoryNavNode[];
}

/**
 * Site footer, same as the shell's (DS NavFooter). Category links stay in this zone
 * (next/link); every other link — the logo, Craft, Help, legal — belongs to the shell and
 * does a full page load. A client component because it hands next/link to NavFooter (also a
 * client component); its only prop, the category list, is plain data.
 */
export function Footer({ categories = [] }: FooterProps) {
  const shopLinks = toFooterLinks(categories);
  const sections = [
    // Hidden when core returned no categories.
    ...(shopLinks.length
      ? [{ id: "shop", title: strings.footer.shopTitle, items: shopLinks }]
      : []),
    ...strings.footer.sections,
  ];

  return (
    <NavFooter
      containerMaxWidth="2xl"
      linkComponent={Link}
      branding={{
        logo: (
          <Image
            src={BRAND_LOGO}
            alt={strings.branding.logoAlt}
            width={140}
            height={34}
            className="h-8 w-auto object-contain"
          />
        ),
        description: strings.footer.tagline,
        href: "/",
        // The home page is the shell: a different zone, so a plain link.
        zone: "shell",
        alt: strings.branding.logoAlt,
      }}
      navigation={{
        sections: sections.map((section) => ({
          id: section.id,
          title: section.title,
          items: section.items.map((item) => ({
            id: item.id,
            label: item.label,
            href: item.href,
            crossZone: !isCatalogHref(item.href),
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
          crossZone: true,
        })),
      }}
    />
  );
}
