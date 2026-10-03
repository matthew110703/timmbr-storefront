import * as React from "react";
import Image from "next/image";
import { Heading, Text, Stack, Inline, LinkButton } from "@timmbr/ui";
import type { HeroSectionData } from "@/lib/api/types";
import { strings } from "@/app/strings";
import { MOCK_DEFAULT_HERO_BANNER } from "@/app/mock";

export interface HeroProps {
  data?: HeroSectionData | null;
  title?: string;
  className?: string;
}

/**
 * Shell Landing Page Hero Section.
 * Implements the artisanal hero banner from Figma (node-id=82-327)
 * consuming dynamic CMS data with fallback to co-located static strings
 * and strictly composing @timmbr/ui primitives (Stack, Inline, Heading, Text, LinkButton).
 */
export const Hero: React.FC<HeroProps> = ({
  data,
  title: titleProp,
  className,
}) => {
  const title = titleProp || data?.title || strings.hero.title;
  const eyebrow = data?.eyebrow || strings.hero.eyebrow;
  const description = data?.description || strings.hero.description;
  const bannerUrl = data?.bannerUrl || MOCK_DEFAULT_HERO_BANNER;
  const primaryCta = data?.cta?.primary || strings.hero.primaryCta;
  const secondaryCta = data?.cta?.secondary || strings.hero.secondaryCta;

  return (
    <section
      title={title}
      aria-label={title}
      data-slot="shell-hero-section"
      className={`relative w-full rounded-2xl overflow-hidden min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex items-center shadow-lg my-6 sm:my-8 ${className ?? ""}`}
    >
      {/* Background Image with Dark Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerUrl}
          alt={strings.hero.bannerAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1440px"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"
        />
      </div>

      {/* Hero Content Container composed with @timmbr/ui primitives */}
      <Stack
        align="start"
        gap={4}
        className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-16 max-w-3xl"
      >
        {/* Eyebrow Tag */}
        {eyebrow && (
          <Text
            as="span"
            font="title"
            weight="bold"
            className="text-xs sm:text-[13px] tracking-[2.34px] uppercase text-bg-1"
          >
            {eyebrow}
          </Text>
        )}

        {/* Main Serif Heading */}
        <Heading
          level={1}
          font="display"
          foreground="white"
          className="text-4xl sm:text-6xl lg:text-[74px] leading-[1.04] tracking-tight"
        >
          {title}
        </Heading>

        {/* Supporting Description */}
        {description && (
          <Text
            as="p"
            variant="subtitle-1"
            weight="semibold"
            foreground="white"
            className="opacity-90 max-w-xl"
          >
            {description}
          </Text>
        )}

        {/* Action Buttons Row */}
        <Inline gap={3} align="center" className="pt-2">
          {primaryCta && (
            <LinkButton
              href={primaryCta.path}
              crossZone
              size="lg"
              className="bg-primary hover:bg-primary-600 text-white font-sans font-semibold text-[15.5px] px-7 py-3.5 rounded-xs border-0 shadow-sm transition-colors cursor-pointer"
            >
              {primaryCta.label}
            </LinkButton>
          )}

          {secondaryCta && (
            <LinkButton
              href={secondaryCta.path}
              crossZone
              size="lg"
              className="border border-white/60 hover:border-white hover:bg-white/10 text-white font-sans font-semibold text-[15.5px] px-7 py-3.5 rounded-xs bg-transparent transition-colors shadow-sm cursor-pointer"
            >
              {secondaryCta.label}
            </LinkButton>
          )}
        </Inline>
      </Stack>
    </section>
  );
};

export default Hero;
