import * as React from "react";
import Image from "next/image";
import { Stack, Text } from "@timmbr/ui";
import type { PerksAndOffersSectionData, PerkItem } from "@/lib/api/types";
import { strings } from "@/app/strings";
import { MOCK_PERKS } from "@/app/mock";
import { ScallopEdgeSvg } from "@/assets";

export interface PerksAndOffersProps {
  data?: PerksAndOffersSectionData | null;
  title?: string;
  className?: string;
}

/**
 * Shell Landing Page Perks and Offers Section (Server Component).
 * Implements the coupon ticket and perks row from Figma (node-id=82-338)
 * strictly composing @timmbr/ui primitives and modular assets.
 */
export const PerksAndOffers: React.FC<PerksAndOffersProps> = ({
  data,
  title: titleProp,
  className,
}) => {
  const title = titleProp || data?.title || strings.perksAndOffers.title;
  const discount = data?.discount || strings.perksAndOffers.discount;
  const perks = data?.perks && data.perks.length > 0 ? data.perks : MOCK_PERKS;

  const prefix = discount.prefix ?? "FLAT";
  const symbol = discount.symbol ?? "₹";
  const rawValue = discount.value ?? 9000;
  const formattedValue =
    typeof rawValue === "number"
      ? rawValue.toLocaleString("en-IN")
      : String(rawValue);
  const suffix = discount.suffix ?? "OFF";
  const discountLabel = discount.label ?? "On Your 1st Purchase";

  return (
    <section
      title={title}
      aria-label={title}
      data-slot="shell-perks-and-offers"
      className={`w-full ${className ?? ""}`}
    >
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-14">
        {/* Left: Terracotta Coupon Ticket */}
        <div
          data-slot="offer-ticket-card"
          className="relative bg-primary h-[76px] rounded-xs shadow-xs flex items-center justify-between w-full lg:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[725px] shrink-0 overflow-hidden"
        >
          {/* Left Section: Value Display */}
          <div className="relative h-full flex-1 flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-6 border-r border-dashed border-white/40">
            {/* FLAT Prefix */}
            <Text
              as="span"
              foreground="white"
              className="font-sans font-extrabold text-lg sm:text-2xl lg:text-[28px] tracking-tight leading-none"
            >
              {prefix}
            </Text>

            {/* Currency Symbol & Amount */}
            <div className="flex items-start gap-0.5 sm:gap-1 leading-none">
              <Text
                as="span"
                weight="bold"
                foreground="white"
                className="text-xs sm:text-sm lg:text-base pt-1"
              >
                {symbol}
              </Text>
              <Text
                as="span"
                foreground="white"
                className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-[40px] leading-none tracking-tight"
              >
                {formattedValue}
              </Text>
            </div>

            {/* OFF Suffix */}
            <Text
              as="span"
              font="display"
              italic
              foreground="white"
              className="text-lg sm:text-2xl lg:text-[28px] leading-none"
            >
              {suffix}
            </Text>

            {/* Top Punch-hole Notch */}
            <div
              aria-hidden="true"
              className="absolute -top-[9px] -right-[9px] w-[18px] h-[18px] rounded-full bg-bg-1 z-10"
            />
            {/* Bottom Punch-hole Notch */}
            <div
              aria-hidden="true"
              className="absolute -bottom-[9px] -right-[9px] w-[18px] h-[18px] rounded-full bg-bg-1 z-10"
            />
          </div>

          {/* Right Section: Offer Description */}
          <div className="h-full w-[170px] sm:w-[220px] lg:w-[240px] xl:w-[258px] shrink-0 flex items-center justify-center px-3 sm:px-4 text-center">
            <Text
              as="span"
              weight="bold"
              className="text-xs sm:text-sm lg:text-[16px] text-bg-2 leading-tight"
            >
              {discountLabel}
            </Text>
          </div>

          {/* Right Scalloped Cutout Edge */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-2 text-bg-1"
          >
            <ScallopEdgeSvg className="w-full h-full" />
          </div>
        </div>

        {/* Right: Perks Group */}
        <div
          data-slot="perks-row"
          className="flex items-center justify-center gap-5 sm:gap-8 lg:gap-9 xl:gap-10 w-full lg:w-auto"
        >
          {perks.map((perk: PerkItem, index: number) => (
            <Stack
              key={perk.label || index}
              align="center"
              gap={1}
              className="shrink-0 text-center"
            >
              {/* Perk Icon */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative flex items-center justify-center shrink-0">
                {perk.iconUrl ? (
                  <Image
                    src={perk.iconUrl}
                    alt={perk.label}
                    width={36}
                    height={36}
                    className="object-contain w-8 h-8 sm:w-9 sm:h-9"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-grey-800/10 flex items-center justify-center text-grey-800" />
                )}
              </div>

              {/* Perk Label */}
              <Text
                as="span"
                italic
                weight="semibold"
                className="font-serif text-xs sm:text-sm lg:text-[15.5px] text-grey-800 whitespace-nowrap leading-tight"
              >
                {perk.label}
              </Text>
            </Stack>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerksAndOffers;
