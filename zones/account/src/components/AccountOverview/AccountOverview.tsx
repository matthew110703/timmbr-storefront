"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  Grid,
  Heading,
  Icon,
  IconTile,
  Inline,
  List,
  ListItem,
  ListItemAction,
  ListItemIcon,
  ListItemText,
  Spinner,
  Stack,
  Text,
  VisuallyHidden,
} from "@timmbr/ui";
import { ChevronRight, LogOut } from "@timmbr/icons";
import { signOut } from "@timmbr/auth";
import { strings } from "@/app/strings";
import { ACCOUNT_SECTIONS } from "@/components/AccountNav";

const t = strings.account;

/** Summary line per section id (orders, wishlist, addresses, security). */
export type OverviewSummaries = Record<
  (typeof ACCOUNT_SECTIONS)[number]["id"],
  string
>;

const chevron = (
  <Icon size="sm" foreground="muted">
    <ChevronRight />
  </Icon>
);

/**
 * The account overview. Phones: an app-style list of sections (the hub) with
 * Log out under it. Desktop: the same sections as cards beside the side nav.
 */
export function AccountOverview({
  summaries,
}: {
  summaries: OverviewSummaries;
}) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    // Leaves /account/* for the home page once signed out.
    await signOut().finally(() => setSigningOut(false));
  };

  return (
    <section aria-labelledby="account-overview-title">
      <VisuallyHidden asChild>
        <Heading level={2} id="account-overview-title">
          {t.overview.title}
        </Heading>
      </VisuallyHidden>

      {/* Phones: the hub. (Visibility by breakpoint: no DS primitive for it yet.) */}
      <Stack asChild gap={4} className="lg:hidden">
        <nav aria-label={t.overview.sectionsLabel}>
          <List variant="bordered" divided>
            {ACCOUNT_SECTIONS.map((section) => (
              <ListItem key={section.id} asChild density="lg">
                <Link href={section.href}>
                  <ListItemIcon>
                    <IconTile>{section.icon}</IconTile>
                  </ListItemIcon>
                  <ListItemText
                    primary={t.nav[section.id]}
                    secondary={summaries[section.id]}
                  />
                  <ListItemAction>{chevron}</ListItemAction>
                </Link>
              </ListItem>
            ))}
          </List>
          <List variant="bordered">
            <ListItem asChild density="lg">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                aria-busy={signingOut || undefined}
              >
                <ListItemIcon>
                  <IconTile tone="destructive">
                    {signingOut ? <Spinner size="sm" /> : <LogOut />}
                  </IconTile>
                </ListItemIcon>
                <ListItemText>
                  <Text
                    as="span"
                    variant="body-1"
                    weight="medium"
                    foreground="destructive"
                  >
                    {t.logout}
                  </Text>
                </ListItemText>
              </button>
            </ListItem>
          </List>
        </nav>
      </Stack>

      {/* Desktop: cards (the side nav is next to them) */}
      <Grid asChild cols={{ lg: 2 }} gap={4} className="hidden lg:grid">
        <ul>
          {ACCOUNT_SECTIONS.map((section) => (
            <li key={section.id}>
              <Card
                asChild
                variant="interactive"
                padding="sm"
                className="block h-full"
              >
                <Link href={section.href}>
                  <Inline align="start" gap={4} wrap={false}>
                    <IconTile>{section.icon}</IconTile>
                    <Stack gap={1} className="min-w-0 flex-1">
                      <Heading level={6} as="h3">
                        {t.nav[section.id]}
                      </Heading>
                      <Text variant="body-2" foreground="muted">
                        {summaries[section.id]}
                      </Text>
                    </Stack>
                    {chevron}
                  </Inline>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}
