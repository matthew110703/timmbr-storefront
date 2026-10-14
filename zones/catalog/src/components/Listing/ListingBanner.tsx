import Image from "next/image";
import { Heading, Inline, Text } from "@timmbr/ui";
import { CheckCircle } from "@timmbr/icons";
import { strings } from "@/app/strings";
import { getPlpBanner } from "@/lib/api/cms";

/**
 * Listing banner (Figma PLP) from the CMS ("catalog" page, "plp-banner" section), with the
 * built-in copy as a field-by-field fallback. Async and streamed in its own Suspense boundary,
 * so a slow CMS never holds back the products.
 */
export async function ListingBanner() {
  const cms = await getPlpBanner();
  const fallback = strings.listing.banner;
  const title = cms?.title || fallback.title;
  const description = cms?.description || fallback.description;
  const imageUrl = cms?.imageUrl || fallback.imageUrl;
  const imageAlt = cms?.imageAlt || fallback.imageAlt;
  const badges = cms?.badges?.length ? cms.badges : fallback.badges;

  return (
    <section
      aria-label={title}
      className="relative isolate flex min-h-56 items-center overflow-hidden rounded-xl bg-grey-100 sm:min-h-72 lg:min-h-96"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="(min-width: 1440px) 1400px, 100vw"
        className="-z-10 object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-grey-50/95 via-grey-50/70 to-transparent"
      />
      <div className="flex max-w-2xl flex-col gap-3 px-5 py-8 sm:px-10 lg:gap-4 lg:px-14">
        <Heading
          level={2}
          font="display"
          className="text-h4 leading-tight text-grey-950 lg:text-h2"
        >
          {title}
        </Heading>
        <Text as="p" variant="body-2" className="max-w-md text-grey-700">
          {description}
        </Text>
        <Inline asChild gap={4} className="mt-2 hidden sm:flex">
          <ul>
            {badges.map((badge) => (
              <li
                key={badge.label}
                className="flex items-center gap-2 text-body-3 text-grey-800"
              >
                <CheckCircle
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {badge.label}
              </li>
            ))}
          </ul>
        </Inline>
      </div>
    </section>
  );
}

/** Same footprint as the banner, shown while it streams in. */
export function ListingBannerSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-56 animate-pulse rounded-xl bg-grey-100 sm:min-h-72 lg:min-h-96"
    />
  );
}
