"use client";

import Image from "next/image";
import { Icon, Inline, NavHeader, Text } from "@timmbr/ui";
import { useProfileAction } from "@timmbr/auth";
import { Lock, Package, User } from "@timmbr/icons";
import { strings } from "@/app/strings";

// Public files are served under the zone's basePath.
const ASSETS = {
  brandLogo: "/checkout/timmbr-logo.png",
  brandMiniLogo: "/checkout/timmbr-leaf.png",
};

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

/**
 * The storefront's header (DS NavHeader, same logo, profile menu and sticky bar as every other
 * zone) in its checkout state: no search or category menus to wander off to, and a reassurance
 * on the right instead. Logo and menu links belong to other zones, so they are plain links.
 */
export function Header() {
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
      search={false}
      navigation={{ show: false }}
      mobile={{ tabSlider: false }}
      actions={{
        // Custom items come before the profile, which stays at the far edge.
        items: [
          {
            id: "secure",
            label: strings.header.secure,
            icon: <Lock />,
            priority: "high",
            render: () => (
              <Inline gap={2} align="center" className="shrink-0 px-2">
                <Icon size="sm">
                  <Lock />
                </Icon>
                <Text variant="body-3" weight="medium" foreground="muted">
                  {strings.header.secure}
                </Text>
              </Inline>
            ),
          },
        ],
        profile: profileAction,
        wishlist: false,
        cart: false,
      }}
    />
  );
}
