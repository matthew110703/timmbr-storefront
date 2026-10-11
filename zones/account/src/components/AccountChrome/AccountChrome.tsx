"use client";

import { usePathname } from "next/navigation";
import { Grid, LinkButton, Stack } from "@timmbr/ui";
import { ChevronLeft } from "@timmbr/icons";
import { strings } from "@/app/strings";

interface AccountChromeProps {
  /** "Your account" title with the user's name and contact. */
  header: React.ReactNode;
  /** Side navigation (desktop only). */
  nav: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Account page frame.
 * - Desktop: header, side nav and the page.
 * - Phones: the overview (`/`) is the hub, under the header; a section page
 *   shows only "‹ Account" and its own title, so the content gets the screen.
 *
 * Visibility by breakpoint (`hidden lg:block`) is plain CSS: the DS has no
 * responsive-visibility primitive yet.
 */
export function AccountChrome({ header, nav, children }: AccountChromeProps) {
  const isHub = usePathname() === "/";

  return (
    <Stack gap={{ base: 6, lg: 8 }}>
      <div
        className={isHub ? undefined : "hidden lg:block"}
        data-testid="account-header"
      >
        {header}
      </div>
      <Grid
        cols={1}
        gap={{ base: 6, lg: 10 }}
        template={{ lg: "15rem minmax(0,1fr)" }}
      >
        <aside
          className="hidden lg:sticky lg:top-28 lg:block lg:self-start"
          data-testid="account-nav"
        >
          {nav}
        </aside>
        <Stack gap={3} className="min-w-0">
          {!isHub && (
            // Same app: LinkButton uses next/link (the basePath is added).
            <LinkButton
              href="/"
              variant="back"
              aria-label={strings.account.backLabel}
              leftIcon={<ChevronLeft size={18} aria-hidden="true" />}
              className="self-start lg:hidden"
            >
              {strings.account.back}
            </LinkButton>
          )}
          {children}
        </Stack>
      </Grid>
    </Stack>
  );
}
