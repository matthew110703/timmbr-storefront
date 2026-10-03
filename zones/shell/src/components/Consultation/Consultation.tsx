import * as React from "react";
import Image from "next/image";
import { Heading, Text, Stack, LinkButton } from "@timmbr/ui";
import type { ConsultationSectionData } from "@/lib/api/types";
import { strings } from "@/app/strings";
import { MOCK_DEFAULT_CONSULTATION_BANNER } from "@/app/mock";

export interface ConsultationProps {
  data?: ConsultationSectionData | null;
  title?: string;
  className?: string;
}

/**
 * Shell Landing Page Consultation Section (Server Component).
 * Implements the bespoke design consultation banner from Figma (node-id=82-483)
 * strictly composing @timmbr/ui primitives and co-located static strings.
 */
export const Consultation: React.FC<ConsultationProps> = ({
  data,
  title: titleProp,
  className,
}) => {
  const title = titleProp || data?.title || strings.consultation.title;
  const eyebrow = data?.eyebrow || strings.consultation.eyebrow;
  const description = data?.description || strings.consultation.description;
  const bannerUrl = data?.bannerUrl || MOCK_DEFAULT_CONSULTATION_BANNER;
  const cta = data?.cta?.primary || strings.consultation.cta;

  return (
    <section
      title={title}
      aria-label={title}
      data-slot="shell-consultation-section"
      className={`relative w-full rounded-xs overflow-hidden bg-surface-dark min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center shadow-xs ${className ?? ""}`}
    >
      {/* Background Image on Right Side */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[58%] lg:w-[54%] z-0">
        <Image
          src={bannerUrl}
          alt={strings.consultation.bannerAlt}
          fill
          sizes="(max-width: 768px) 100vw, 54vw"
          className="object-cover object-center"
        />
        {/* Horizontal Gradient Fade into dark solid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-surface-dark from-[15%] via-surface-dark/80 to-transparent hidden sm:block"
        />
        {/* Vertical Gradient Fade for Mobile */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/75 to-transparent sm:hidden"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-14 py-12 sm:py-16 max-w-2xl">
        <Stack align="start" gap={5} className="w-full">
          {/* Eyebrow & Titles Stack */}
          <Stack align="start" gap={2} className="w-full">
            {eyebrow && (
              <Text
                as="span"
                font="title"
                weight="semibold"
                className="text-xs sm:text-[13px] tracking-[2.25px] uppercase text-primary-200"
              >
                {eyebrow}
              </Text>
            )}

            <Heading
              level={2}
              font="display"
              className="text-2xl sm:text-3xl lg:text-[38px] text-bg-2 leading-[1.12] tracking-tight"
            >
              {title}
            </Heading>

            {description && (
              <Text
                as="p"
                variant="body-1"
                className="text-sm sm:text-[15.5px] text-sand-muted leading-[1.6] max-w-md pt-1"
              >
                {description}
              </Text>
            )}
          </Stack>

          {/* CTA Action Button */}
          {cta && (
            <div className="pt-2">
              <LinkButton
                href={cta.path}
                crossZone
                size="lg"
                className="bg-primary hover:bg-primary-600 text-white font-sans font-semibold text-sm sm:text-[15px] px-6 py-3 rounded-xs border-0 shadow-xs transition-colors cursor-pointer"
              >
                {cta.label}
              </LinkButton>
            </div>
          )}
        </Stack>
      </div>
    </section>
  );
};

export default Consultation;
