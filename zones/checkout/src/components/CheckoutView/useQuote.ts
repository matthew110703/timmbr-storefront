"use client";

import { useEffect, useState } from "react";
import { paymentErrorMessage, paymentsApi } from "@timmbr/payments";
import type { CheckoutItem, CheckoutQuote } from "@timmbr/payments/contract";

interface QuoteState {
  key: string;
  quote: CheckoutQuote | null;
  error: string | null;
}

const keyOf = (items: CheckoutItem[], addressId: string | null) =>
  JSON.stringify([items, addressId]);

/**
 * Core's price for these lines and address. Starts from the quote the server already fetched and
 * asks again whenever the lines or the address change (`loading` until the answer arrives).
 */
export function useQuote(
  items: CheckoutItem[],
  addressId: string | null,
  initial: CheckoutQuote | null,
) {
  const key = keyOf(items, addressId);
  // Without a server quote there is nothing to show yet: ask at once (and explain if it fails).
  const [state, setState] = useState<QuoteState>({
    key: initial ? key : "",
    quote: initial,
    error: null,
  });

  useEffect(() => {
    if (!addressId || items.length === 0 || state.key === key) return;

    let cancelled = false;
    paymentsApi
      .quote(items, addressId)
      .then((quote) => {
        if (!cancelled) setState({ key, quote, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          key,
          quote: null,
          error: paymentErrorMessage(error),
        });
      });

    return () => {
      cancelled = true;
    };
    // `items` is captured through `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, addressId]);

  const loading = !!addressId && items.length > 0 && state.key !== key;
  return {
    // The previous price stays visible (dimmed) while the new one loads. Paying is blocked
    // until it arrives (`loading`), so the stale figure can never be charged.
    quote: state.quote,
    loading,
    error: state.key === key ? state.error : null,
  };
}
