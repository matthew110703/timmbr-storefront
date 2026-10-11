"use client";

import Image from "next/image";
import { Icon, NavHeader } from "@timmbr/ui";
import { useProfileAction } from "@timmbr/auth";
import { Package, User } from "@timmbr/icons";
import { strings } from "@/app/strings";
import { ASSETS } from "../../../public";

/** Desktop profile menu links (from strings); stable across renders. */
const MENU_ICONS: Record<string, React.ReactNode> = {
  orders: (
    <Icon size="sm">
      <Package />
    </Icon>
  ),
  account: (
    <Icon size="sm">
      <User />
    </Icon>
  ),
};
const PROFILE_MENU = strings.header.actions.account.menu.map((item) => ({
  ...item,
  icon: MENU_ICONS[item.id],
}));

export function Header() {
  // LOGIN / skeleton while loading / first name: same behaviour in every zone.
  const { profileAction, onAuthTrigger } = useProfileAction({
    accountHref: strings.header.actions.account.href,
    menuItems: PROFILE_MENU,
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
        wishlist: {
          label: strings.header.actions.wishlist.label,
          href: strings.header.actions.wishlist.href,
          ariaLabel: strings.header.actions.wishlist.ariaLabel,
          // The wishlist lives in the account zone: full navigation.
          crossZone: true,
        },
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
