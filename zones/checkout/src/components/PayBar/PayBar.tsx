"use client";

import { useState } from "react";
import type { CheckoutQuote } from "@timmbr/payments/contract";
import { Button, Icon, Inline, Stack, Text } from "@timmbr/ui";
import { ChevronUp, Lock } from "@timmbr/icons";
import { cn, formatCurrency } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { CollapsePanel } from "@/components/CollapsePanel";

const t = strings.summary;

export interface PayBarProps {
  quote: CheckoutQuote | null;
  itemCount: number;
  canPay: boolean;
  busy: boolean;
  busyLabel: string;
  /** Shown instead of the secure note when paying is not possible yet. */
  hint?: string | null;
  onPay: () => void;
}

/**
 * The Pay button. Phones: pinned to the bottom with the total beside it, and a tap on the total
 * opens the price breakdown right there, so the amount is never more than a glance away.
 * Desktop: sits in the sticky side column under the order summary.
 */
export function PayBar({
  quote,
  itemCount,
  canPay,
  busy,
  busyLabel,
  hint,
  onPay,
}: PayBarProps) {
  const [open, setOpen] = useState(false);
  const money = (amount: number) => formatCurrency(amount, quote?.currency);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background px-4 pb-3 pt-2 shadow-[0_-6px_16px_rgba(0,0,0,0.08)] lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <Stack gap={2}>
        {quote && (
          <div className="lg:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="pay-bar-details"
              onClick={() => setOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Text variant="body-3" foreground="muted">
                {t.details}
              </Text>
              <Inline gap={2} align="center" wrap={false}>
                <Text variant="body-1" weight="bold" data-testid="bar-total">
                  {money(quote.grandTotal)}
                </Text>
                <span
                  aria-hidden="true"
                  className={cn(
                    "transition-transform duration-200 motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                >
                  <Icon size="sm">
                    <ChevronUp />
                  </Icon>
                </span>
              </Inline>
            </button>
            <CollapsePanel id="pay-bar-details" open={open}>
              <Stack gap={1} className="pb-2 pt-1" data-testid="bar-details">
                <Inline justify="between" wrap={false}>
                  <Text variant="body-3" foreground="muted">
                    {t.items(itemCount)}
                  </Text>
                  <Text variant="body-3">{money(quote.subtotal)}</Text>
                </Inline>
                <Inline justify="between" wrap={false}>
                  <Text variant="body-3" foreground="muted">
                    {t.delivery}
                  </Text>
                  <Text variant="body-3">
                    {quote.shippingFee > 0 ? money(quote.shippingFee) : t.free}
                  </Text>
                </Inline>
                {quote.discount > 0 && (
                  <Inline justify="between" wrap={false}>
                    <Text variant="body-3" foreground="muted">
                      {t.discount}
                    </Text>
                    <Text variant="body-3">{`-${money(quote.discount)}`}</Text>
                  </Inline>
                )}
                {quote.tax > 0 && (
                  <Text variant="body-3" foreground="muted">
                    {t.tax(money(quote.tax))}
                  </Text>
                )}
              </Stack>
            </CollapsePanel>
          </div>
        )}

        <Button
          size="lg"
          fullWidth
          className="h-12 font-bold uppercase tracking-[1px]"
          disabled={!canPay}
          loading={busy}
          loadingText={busyLabel}
          onClick={onPay}
        >
          {quote
            ? strings.pay.button(money(quote.grandTotal))
            : strings.pay.button("")}
        </Button>

        {hint ? (
          <Text variant="body-3" foreground="muted" className="text-center">
            {hint}
          </Text>
        ) : (
          <Inline
            gap={2}
            justify="center"
            align="center"
            className="max-lg:hidden"
          >
            <Icon size="sm">
              <Lock />
            </Icon>
            <Text variant="body-3" foreground="muted">
              {strings.pay.secure}
            </Text>
          </Inline>
        )}
      </Stack>
    </div>
  );
}
