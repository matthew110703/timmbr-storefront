import { NextResponse } from "next/server";
import type { AuthModalBannerData } from "@timmbr/ui";
import type { AuthBannerResponse } from "@timmbr/auth/contract";
import { getPageBySlug, isAuthBannerSection } from "@/lib/api";
import { strings } from "@/app/strings";

const CDN = "https://pub-dc2a8fc90be54a65b2d2000bed9fc8d2.r2.dev/cms";

/** Shown when the CMS "auth" page has no banner (or the CMS is unreachable). */
export const FALLBACK_AUTH_BANNER: AuthModalBannerData = {
  ...strings.auth.banner,
  imageUrl: `${CDN}/auth-modal-banner.png`,
  iconUrl: `${CDN}/auth-modal-icon.svg`,
};

/** The auth modal's banner from the CMS, with the fallback filling any gaps. */
export async function loadAuthBanner(): Promise<AuthModalBannerData> {
  const page = await getPageBySlug("auth");
  const section = page?.sections?.find(isAuthBannerSection);
  if (!section) return FALLBACK_AUTH_BANNER;
  return {
    title: section.title ?? FALLBACK_AUTH_BANNER.title,
    subtitle: section.subtitle ?? FALLBACK_AUTH_BANNER.subtitle,
    promoBadge: section.promoBadge ?? FALLBACK_AUTH_BANNER.promoBadge,
    termsNotice: section.termsNotice ?? FALLBACK_AUTH_BANNER.termsNotice,
    imageUrl: section.imageUrl ?? FALLBACK_AUTH_BANNER.imageUrl,
    iconUrl: section.iconUrl ?? FALLBACK_AUTH_BANNER.iconUrl,
  };
}

/**
 * `GET /api/auth/banner`. Every zone's auth modal (from @timmbr/auth) reads its
 * banner here, so only the shell knows about the CMS. The CMS call itself is
 * cached (ISR, 60s); browsers may reuse the answer briefly too.
 */
export async function bannerHandler(): Promise<NextResponse> {
  const data: AuthBannerResponse = { banner: await loadAuthBanner() };
  return NextResponse.json(
    { success: true, data },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
