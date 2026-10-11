"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubNav, SubNavAction, type SubNavItem } from "@timmbr/ui";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from "@timmbr/icons";
import { signOut } from "@timmbr/auth";
import { strings } from "@/app/strings";

const nav = strings.account.nav;

/**
 * The account sections (overview cards, the phone hub and the side nav).
 * Hrefs are relative to this zone: next/link and usePathname both work
 * without the "/account" basePath (Next adds it to the links it renders).
 */
export const ACCOUNT_SECTIONS = [
  { id: "orders", href: "/orders", icon: <Package /> },
  { id: "wishlist", href: "/wishlist", icon: <Heart /> },
  { id: "addresses", href: "/addresses", icon: <MapPin /> },
  { id: "security", href: "/security", icon: <ShieldCheck /> },
] as const;

export const ACCOUNT_NAV_ITEMS: SubNavItem[] = [
  { id: "overview", label: nav.overview, href: "/", icon: <User /> },
  ...ACCOUNT_SECTIONS.map((section) => ({
    ...section,
    label: nav[section.id],
  })),
];

/** Side navigation of the account area (desktop; phones use the overview hub). */
export function AccountNav() {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    // Leaves /account/* for the home page once signed out.
    await signOut().finally(() => setSigningOut(false));
  };

  return (
    <SubNav
      aria-label={strings.account.navLabel}
      items={ACCOUNT_NAV_ITEMS}
      activeHref={pathname}
      linkComponent={Link}
      footer={
        <SubNavAction
          icon={<LogOut />}
          tone="destructive"
          loading={signingOut}
          onClick={handleSignOut}
        >
          {strings.account.logout}
        </SubNavAction>
      }
    />
  );
}
