"use client";

import Image from "next/image";
import { Icon, NavHeader, toNavMenuItems } from "@timmbr/ui";
import { useCartCount, useProfileAction } from "@timmbr/auth";
import { Package, User } from "@timmbr/icons";
import { strings } from "@/app/strings";
import { toCategoryMenus, type CategoryNavNode } from "@/lib/category-nav";
import { useHeaderSearch } from "./useHeaderSearch";
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

export interface HeaderProps {
  /** Nav roots from timmbr-core, trimmed by the layout (`toNavTree`). */
  categories?: CategoryNavNode[];
}

export function Header({ categories = [] }: HeaderProps) {
  // LOGIN / skeleton while loading / first name: same behaviour in every zone.
  const { profileAction, onAuthTrigger } = useProfileAction({
    accountHref: strings.header.actions.account.href,
    menuItems: PROFILE_MENU,
  });
  // Recent searches + product suggestions; submitting opens /products?q=… (catalog zone).
  const search = useHeaderSearch();
  // Shared with every zone and tab; 0 until the first load answers.
  const cartCount = useCartCount() ?? 0;
  // Category pages live in the catalog zone: full navigation from here.
  const navItems = toNavMenuItems(
    toCategoryMenus(categories, strings.header.categoryNav),
    { crossZone: true },
  );

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
      navigation={{ items: navItems }}
      search={search}
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
          count: cartCount,
        },
      }}
    />
  );
}
