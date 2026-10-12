"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon, NavHeader, toNavMenuItems } from "@timmbr/ui";
import { useProfileAction } from "@timmbr/auth";
import { Package, User } from "@timmbr/icons";
import { strings } from "@/app/strings";
import { toCategoryMenus, type CategoryNavNode } from "@/lib/category-nav";

// Public files live under the zone's assetPrefix (public/catalog-static/),
// a path the shell already routes to this zone.
const ASSETS = {
  brandLogo: "/catalog-static/timmbr-logo.png",
  brandMiniLogo: "/catalog-static/timmbr-leaf.png",
};

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
  // LOGIN / skeleton while loading / first name; LOGIN opens the auth modal
  // right here (mounted in the layout), so the shopper never leaves the page.
  const { profileAction, onAuthTrigger } = useProfileAction({
    accountHref: strings.header.actions.account.href,
    menuItems: PROFILE_MENU,
  });
  // Category pages are in this zone: next/link, no page reload.
  const navItems = toNavMenuItems(
    toCategoryMenus(categories, strings.header.categoryNav),
    { linkComponent: Link },
  );

  return (
    <NavHeader
      sticky
      authMode="modal"
      onAuthTrigger={onAuthTrigger}
      showOfferBanner={false}
      containerMaxWidth="2xl"
      // Category and product links stay in this zone: soft navigation.
      // Links to other zones are marked crossZone (or zone) and stay plain <a>.
      linkComponent={Link}
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
        // "/" is the shell's home page: full navigation.
        zone: "shell",
        alt: strings.branding.logoAlt,
      }}
      navigation={{ items: navItems }}
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
          // The cart lives in the checkout zone: full navigation.
          crossZone: true,
        },
      }}
    />
  );
}
