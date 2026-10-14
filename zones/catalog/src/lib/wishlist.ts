"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { openAuthModal, useSession } from "@timmbr/auth";
import { toast } from "@timmbr/ui";
import { wishlistApi } from "@/lib/api/browser";
import type { WishlistEntry } from "@/lib/api/types";

/**
 * The signed-in shopper's wishlist, for every heart on the page (cards and the product page):
 * loaded once (one request, however many hearts), changed optimistically, rolled back if core
 * refuses. Signed out, a heart opens the sign-in modal and saves once signed in.
 *
 * Module state: one store per page bundle.
 */

interface WishlistState {
  /** null until loaded (or while signed out). */
  items: WishlistEntry[] | null;
}

let state: WishlistState = { items: null };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: WishlistState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getState = () => state;
const SERVER_STATE: WishlistState = { items: null };

function load() {
  loading ??= wishlistApi
    .list()
    .then(({ items }) =>
      emit({
        items: items.map(({ productId, variantId }) => ({
          productId,
          variantId,
        })),
      }),
    )
    .catch(() => {})
    .finally(() => {
      loading = null;
    });
  return loading;
}

export interface WishlistCopy {
  added: string;
  removed: string;
  failed: string;
}

async function write(entry: WishlistEntry, save: boolean, copy: WishlistCopy) {
  const before = state.items ?? [];
  emit({
    items: save
      ? [...before, entry]
      : before.filter((item) => item.variantId !== entry.variantId),
  });
  try {
    if (save) await wishlistApi.add(entry.variantId);
    else await wishlistApi.remove(entry.variantId);
    toast.success(save ? copy.added : copy.removed);
  } catch {
    emit({ items: before });
    toast.error(copy.failed);
  }
}

/**
 * Hearts' shared state. `isProductSaved` (cards: any variant of the product) and
 * `isVariantSaved` (product page: that exact variant). `toggle` saves `variantId`, or removes the
 * saved entry (for a product, whichever of its variants is saved).
 */
export function useWishlist(copy: WishlistCopy) {
  const { status } = useSession();
  const { items } = useSyncExternalStore(
    subscribe,
    getState,
    () => SERVER_STATE,
  );

  useEffect(() => {
    if (status === "authenticated" && state.items === null) void load();
    if (status === "anonymous" && state.items !== null) emit({ items: null });
  }, [status]);

  const isProductSaved = useCallback(
    (productId: string) =>
      !!items?.some((item) => item.productId === productId),
    [items],
  );
  const isVariantSaved = useCallback(
    (variantId: string) =>
      !!items?.some((item) => item.variantId === variantId),
    [items],
  );

  const toggle = useCallback(
    (productId: string, variantId: string, match: "product" | "variant") => {
      if (status !== "authenticated") {
        // Sign in first, then save what was asked for (unless it's already saved there).
        openAuthModal({
          onSuccess: () =>
            void load().then(() => {
              const saved = state.items?.some((item) =>
                match === "product"
                  ? item.productId === productId
                  : item.variantId === variantId,
              );
              if (!saved) void write({ productId, variantId }, true, copy);
            }),
        });
        return;
      }
      const existing = (state.items ?? []).find((item) =>
        match === "product"
          ? item.productId === productId
          : item.variantId === variantId,
      );
      void write(existing ?? { productId, variantId }, !existing, copy);
    },
    [status, copy],
  );

  return { isProductSaved, isVariantSaved, toggle };
}

/** Test helper. */
export function __resetWishlistForTests() {
  state = { items: null };
  loading = null;
}
