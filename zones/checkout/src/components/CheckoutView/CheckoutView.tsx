"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { setCartCount, setCartLines } from "@timmbr/auth";
import { usePayment } from "@timmbr/payments";
import type { CheckoutQuote, PaymentMethod } from "@timmbr/payments/contract";
import { AnimatePresence, collapseVariants, motion } from "@timmbr/motion";
import { Alert, Button, toast, useGlobalAnimation } from "@timmbr/ui";
import { cn, formatCurrency, isApiError } from "@timmbr/utils";
import { strings } from "@/app/strings";
import { AddressSummary } from "@/components/AddressSummary";
import { CartLineCard } from "@/components/CartLineCard";
import { OrderSummary } from "@/components/OrderSummary";
import { PayBar } from "@/components/PayBar";
import { PaymentMethods, methodLabel } from "@/components/PaymentMethods";
import { SavedForLater } from "@/components/SavedForLater";
import { StepSection } from "@/components/StepSection";
import { cartApi, wishlistApi } from "@/lib/api/browser";
import type { Address, Cart, CartLine, SavedItem } from "@/lib/api/types";
import { cartErrorMessage } from "@/lib/cart-errors";
import {
  addressName,
  payableLines,
  pickInitialAddress,
  toCheckoutItems,
} from "@/lib/checkout";
import { usePrefersReducedMotion } from "@/lib/media";
import { readLastMethod, writeLastMethod } from "@/lib/method-memory";
import { useQuote } from "./useQuote";

type Step = "cart" | "delivery" | "pay";

/**
 * A cart line that folds open and shut when it comes or goes. `AnimatePresence` keeps a removed
 * line mounted until its exit has played; with animation off it is just a wrapper.
 */
function LineRow({
  animate,
  children,
}: {
  animate: boolean;
  children: ReactNode;
}) {
  if (!animate) return <div>{children}</div>;
  return (
    <motion.div
      variants={collapseVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

/** The remembered method never changes while the page is open. */
const subscribeNever = () => () => {};

export interface CheckoutViewProps {
  cart: Cart;
  addresses: Address[];
  /** The server's price for the default address, so the page paints with a total. */
  initialQuote: CheckoutQuote | null;
  /** The shopper's wishlist, offered under the cart as "Saved for later". */
  saved?: SavedItem[];
}

/**
 * The checkout page. Phones: three collapsible steps (Cart, Delivery, Payment) on one page with
 * the Pay button pinned to the bottom, so the page stays short and Pay is always in reach.
 * Desktop: everything open, cart and payment on the left, delivery, totals and Pay in a sticky
 * column on the right. Prices come from core (`useQuote`); the payment is `usePayment`.
 */
export function CheckoutView({
  cart,
  addresses,
  initialQuote,
  saved = [],
}: CheckoutViewProps) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const [addressId, setAddressId] = useState<string | null>(
    () => pickInitialAddress(addresses)?.id ?? null,
  );
  const [step, setStep] = useState<Step | null>(() =>
    pickInitialAddress(addresses) ? "cart" : "delivery",
  );
  // The method this browser paid with last time. Storage is client-only, so the server render
  // sees null and the client picks it up after hydration.
  const lastUsed = useSyncExternalStore(
    subscribeNever,
    readLastMethod,
    () => null,
  );
  const [picked, setPicked] = useState<PaymentMethod | null>(null);
  const method = picked ?? lastUsed ?? "upi";
  const [changing, setChanging] = useState(false);
  // One cart change at a time: a second tap while one is in flight is ignored rather than
  // disabling the button under the shopper's finger (which would drop keyboard focus).
  const changeInFlight = useRef(false);
  // Lines slide in and out unless animations are off (DS switch) or the system asks for less.
  const animationsOn = useGlobalAnimation();
  const reducedMotion = usePrefersReducedMotion();
  const animateLines = animationsOn && !reducedMotion;

  const lines = cart.items;
  const items = toCheckoutItems(lines);
  const unitCount = items.reduce((sum, item) => sum + item.quantity, 0);
  // Everything in the cart, including lines that can no longer be bought.
  const cartUnits = lines.reduce((sum, line) => sum + line.quantity, 0);
  const hasUnavailable = payableLines(lines).length !== lines.length;
  const selected = addresses.find((address) => address.id === addressId);

  // The header badge follows what this page shows.
  useEffect(() => {
    setCartLines(
      lines.map(({ variantId, quantity }) => ({ variantId, quantity })),
    );
  }, [lines]);

  const {
    quote,
    loading,
    error: quoteError,
  } = useQuote(items, addressId, initialQuote);

  const payment = usePayment({
    onSuccess: ({ orderId }) => {
      writeLastMethod(method);
      setCartCount(0);
      router.push(`/success?orderId=${encodeURIComponent(orderId)}`);
    },
  });

  // A failure should reach the shopper wherever they have scrolled to.
  useEffect(() => {
    if (payment.error) toast.error(payment.error);
  }, [payment.error]);

  async function changeCart(
    change: () => Promise<unknown>,
    successMessage?: string,
  ) {
    if (changeInFlight.current) return;
    changeInFlight.current = true;
    setChanging(true);
    try {
      await change();
      if (successMessage) toast.success(successMessage);
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error(cartErrorMessage(error));
    } finally {
      changeInFlight.current = false;
      setChanging(false);
    }
  }

  const onQuantityChange = (line: CartLine, quantity: number) =>
    changeCart(() => cartApi.updateQuantity(line.id, quantity));
  const onRemove = (line: CartLine) =>
    changeCart(() => cartApi.remove(line.id));
  const onSaveForLater = (line: CartLine) =>
    changeCart(async () => {
      try {
        await wishlistApi.add(line.variantId);
      } catch (error) {
        // Already on the wishlist is fine: it still leaves the cart.
        if (!(isApiError(error) && error.statusCode === 409)) throw error;
      }
      await cartApi.remove(line.id);
    }, strings.cart.savedToast);
  const onMoveToCart = (item: SavedItem) =>
    changeCart(async () => {
      await cartApi.add(item.variantId, 1);
      await wishlistApi.remove(item.variantId);
    }, strings.saved.movedToast);

  // After a successful payment the page is already on its way to the confirmation; paying
  // again from here would charge for a cart that has just been converted.
  const paid = payment.phase === "success";
  const locked = payment.busy || paid || changing || refreshing;
  const limit = quote?.paymentLimit;
  const overLimit = !!quote && !!limit && quote.grandTotal > limit;
  const canPay =
    !!selected &&
    !!quote &&
    items.length > 0 &&
    !hasUnavailable &&
    !overLimit &&
    !loading &&
    !locked;

  function pay() {
    if (!selected || !canPay) return;
    void payment.pay({
      items,
      shippingAddressId: selected.id,
      method,
      prefill: { name: addressName(selected), contact: selected.phone },
    });
  }

  const toggle = (target: Step) => (open: boolean) =>
    setStep(open ? target : null);

  const busyLabel =
    payment.phase === "verifying"
      ? strings.pay.verifying
      : paid
        ? strings.pay.done
        : strings.pay.working;

  return (
    <div className="flex flex-col gap-4 py-4 pb-44 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-x-6 lg:gap-y-4 lg:py-8 lg:pb-8">
      <div className="contents lg:flex lg:flex-col lg:gap-4">
        <StepSection
          index={1}
          title={strings.steps.cart.title}
          count={cartUnits}
          countLabel={strings.steps.cart.countLabel(cartUnits)}
          summary={strings.steps.cart.summary(
            unitCount,
            formatCurrency(Number(cart.subtotal), cart.currency),
          )}
          open={step === "cart"}
          done={step !== "cart" && !hasUnavailable}
          onOpenChange={toggle("cart")}
          testId="step-cart"
          className="order-1 lg:order-none"
        >
          {hasUnavailable && (
            <Alert variant="warning" className="mb-4">
              {strings.cart.unavailableNotice}
            </Alert>
          )}
          <div
            aria-busy={changing || refreshing}
            className={cn(
              "transition-opacity duration-200 motion-reduce:transition-none [&>*:first-child>article]:pt-0 [&>*:last-child>article]:border-b-0 [&>*:last-child>article]:pb-0",
              (changing || refreshing) && "opacity-60",
            )}
          >
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <LineRow key={line.id} animate={animateLines}>
                  <CartLineCard
                    line={line}
                    busy={changing || refreshing}
                    onQuantityChange={onQuantityChange}
                    onRemove={onRemove}
                    onSaveForLater={onSaveForLater}
                  />
                </LineRow>
              ))}
            </AnimatePresence>
          </div>
          <Button
            fullWidth
            variant="outline"
            className="mt-4 lg:hidden"
            disabled={hasUnavailable}
            onClick={() => setStep("delivery")}
          >
            {strings.steps.next.delivery}
          </Button>
        </StepSection>

        <SavedForLater
          items={saved}
          busy={locked}
          onMoveToCart={onMoveToCart}
          className="order-2 lg:order-none"
        />

        <StepSection
          index={3}
          title={strings.steps.pay.title}
          summary={strings.steps.pay.summary(methodLabel(method))}
          open={step === "pay"}
          onOpenChange={toggle("pay")}
          testId="step-pay"
          className="order-4 lg:order-none"
        >
          <PaymentMethods
            value={method}
            onChange={setPicked}
            lastUsed={lastUsed}
            disabled={payment.busy}
          />
        </StepSection>
      </div>

      <div className="contents lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-4">
        {(overLimit || payment.error) && (
          <div className="order-0 flex flex-col gap-4 lg:order-none">
            {overLimit && limit && (
              <Alert variant="warning">
                {strings.pay.overLimit(formatCurrency(limit, quote?.currency))}
              </Alert>
            )}
            {payment.error && (
              <Alert variant="destructive" title={strings.paymentFailed.title}>
                {payment.error}
              </Alert>
            )}
          </div>
        )}

        <StepSection
          index={2}
          title={strings.steps.delivery.title}
          summary={
            selected
              ? strings.steps.delivery.summary(
                  addressName(selected),
                  `${selected.city} ${selected.postalCode}`,
                )
              : strings.steps.delivery.missing
          }
          open={step === "delivery"}
          done={!!selected && step !== "delivery"}
          onOpenChange={toggle("delivery")}
          testId="step-delivery"
          className="order-3 lg:order-none"
        >
          <AddressSummary
            addresses={addresses}
            selectedId={addressId}
            onSelect={setAddressId}
            disabled={payment.busy}
          />
          <Button
            fullWidth
            variant="outline"
            className="mt-4 lg:hidden"
            disabled={!selected}
            onClick={() => setStep("pay")}
          >
            {strings.steps.next.pay}
          </Button>
        </StepSection>

        <div className="hidden lg:block">
          <OrderSummary
            quote={quote}
            itemCount={unitCount}
            loading={loading}
            error={quoteError}
          />
        </div>

        <PayBar
          quote={quote}
          itemCount={unitCount}
          canPay={canPay}
          busy={payment.busy || paid}
          busyLabel={busyLabel}
          hint={selected ? null : strings.pay.needAddress}
          onPay={pay}
        />
      </div>
    </div>
  );
}
