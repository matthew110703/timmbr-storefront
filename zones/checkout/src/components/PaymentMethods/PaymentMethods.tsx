"use client";

import type { ReactNode } from "react";
import type { PaymentMethod } from "@timmbr/payments/contract";
import { Icon, RadioCard, RadioGroup, Stack, Text } from "@timmbr/ui";
import { CalendarClock, CreditCard, Landmark, Smartphone } from "@timmbr/icons";
import { strings } from "@/app/strings";

const t = strings.payment;

/** The methods offered, in order. Each preselects its tab in the Razorpay window. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  "upi",
  "card",
  "netbanking",
  "emi",
];

const ICONS: Record<PaymentMethod, ReactNode> = {
  upi: <Smartphone />,
  card: <CreditCard />,
  netbanking: <Landmark />,
  emi: <CalendarClock />,
};

export function methodLabel(method: PaymentMethod) {
  return t.chips[method];
}

export interface PaymentMethodsProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  /** The method paid with last time in this browser, marked so a repeat buyer can just pay. */
  lastUsed?: PaymentMethod | null;
  disabled?: boolean;
}

/**
 * Four method chips that preselect the matching tab in Razorpay's window (which still offers
 * everything else), instead of a long list that repeated Razorpay's own picker.
 */
export function PaymentMethods({
  value,
  onChange,
  lastUsed,
  disabled,
}: PaymentMethodsProps) {
  return (
    <Stack gap={3}>
      <RadioGroup
        aria-label={t.title}
        value={value}
        onValueChange={(next) => onChange(next as PaymentMethod)}
        disabled={disabled}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {PAYMENT_METHODS.map((method) => (
          <RadioCard
            key={method}
            variant="card"
            value={method}
            label={methodLabel(method)}
            description={method === lastUsed ? t.lastUsed : undefined}
            icon={<Icon size="md">{ICONS[method]}</Icon>}
            className="min-h-14 px-3 py-3"
          />
        ))}
      </RadioGroup>
      <Text variant="body-3" foreground="muted">
        {t.note}
      </Text>
    </Stack>
  );
}
