"use client";

import Image from "next/image";
import { NavHeader } from "@timmbr/ui";
import { useProfileAction } from "@timmbr/auth";
import { strings } from "@/app/strings";
import { ASSETS } from "../../../public";

export function Header() {
  // LOGIN / skeleton while loading / first name: same behaviour in every zone.
  const { profileAction, onAuthTrigger } = useProfileAction({
    accountHref: strings.header.actions.account.href,
  });

  return (
    <NavHeader
      sticky
      authMode="modal"
      onAuthTrigger={onAuthTrigger}
      showOfferBanner={false}
      containerMaxWidth="2xl"
      branding={{
        logo: (
          <Image
            src={ASSETS.brandLogo}
            alt={strings.branding.logoAlt}
            width={130}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        ),
        miniLogo: (
          <Image
            src={ASSETS.brandMiniLogo}
            alt={strings.branding.miniLogoAlt}
            width={32}
            height={32}
            priority
            className="h-8 w-8 object-contain"
          />
        ),
        href: "/",
        alt: strings.branding.logoAlt,
      }}
      navigation={{
        items: strings.header.navItems.map((item) => ({
          id: item.id,
          label: item.label,
          href: item.href,
        })),
      }}
      search={{
        show: true,
        placeholder: strings.header.search.placeholder,
        popularSearchesTitle: strings.header.search.popularTitle,
        popularSearches: strings.header.search.popularTags.map((tag, idx) => ({
          id: `search-tag-${idx}`,
          label: tag.label,
          href: tag.href,
        })),
      }}
      actions={{
        profile: profileAction,
        cart: {
          label: strings.header.actions.cart.label,
          href: strings.header.actions.cart.href,
          ariaLabel: strings.header.actions.cart.ariaLabel,
          count: 0,
        },
      }}
    />
  );
}
