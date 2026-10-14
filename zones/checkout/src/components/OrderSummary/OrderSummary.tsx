import type { CheckoutQuote } from "@timmbr/payments/contract";
import {
  Card,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  Divider,
  Skeleton,
  Stack,
  Text,
} from "@timmbr/ui";
import { cn, formatCurrency } from "@timmbr/utils";
import { strings } from "@/app/strings";

const t = strings.summary;

export interface OrderSummaryProps {
  /** What core will charge; null while it is loading or when pricing failed. */
  quote: CheckoutQuote | null;
  itemCount: number;
  /** The quote is being refreshed (cart or address changed). */
  loading?: boolean;
  /** Why there is no quote, in words. */
  error?: string | null;
}

/** Core's totals: subtotal, delivery, any discount, and the amount that will be charged. */
export function OrderSummary({
  quote,
  itemCount,
  loading = false,
  error = null,
}: OrderSummaryProps) {
  const money = (amount: number) => formatCurrency(amount, quote?.currency);

  return (
    <Card
      variant="subtle"
      padding="none"
      aria-busy={loading}
      className={cn(
        "p-5 transition-opacity duration-200 motion-reduce:transition-none",
        loading && quote && "opacity-60",
      )}
    >
      <Stack gap={4}>
        <Text variant="body-1" weight="semibold">
          {t.title}
        </Text>

        {quote ? (
          <>
            <DataList orientation="justified" size="sm" inset="none">
              <DataListItem>
                <DataListLabel>{t.items(itemCount)}</DataListLabel>
                <DataListValue>{money(quote.subtotal)}</DataListValue>
              </DataListItem>
              <DataListItem>
                <DataListLabel>{t.delivery}</DataListLabel>
                <DataListValue>
                  {quote.shippingFee > 0 ? money(quote.shippingFee) : t.free}
                </DataListValue>
              </DataListItem>
              {quote.discount > 0 && (
                <DataListItem>
                  <DataListLabel>{t.discount}</DataListLabel>
                  <DataListValue>{`-${money(quote.discount)}`}</DataListValue>
                </DataListItem>
              )}
            </DataList>
            <Divider />
            <DataList orientation="justified" inset="none">
              <DataListItem emphasis="total">
                <DataListLabel>{t.total}</DataListLabel>
                <DataListValue
                  data-testid="grand-total"
                  className="text-[22px] font-extrabold leading-none"
                >
                  {money(quote.grandTotal)}
                </DataListValue>
              </DataListItem>
            </DataList>
            {quote.tax > 0 && (
              <Text variant="body-3" foreground="muted">
                {t.tax(money(quote.tax))}
              </Text>
            )}
          </>
        ) : loading ? (
          <Stack gap={3} aria-label={t.quoteLoading}>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </Stack>
        ) : (
          <Text variant="body-2" foreground={error ? "destructive" : "muted"}>
            {error ?? t.quoteLoading}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
