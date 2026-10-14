"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "@timmbr/hooks";
import {
  listingReducer,
  type ListingAction,
  type ListingState,
} from "@timmbr/utils";
import type { Listing } from "@/lib/api/types";
import { listingHref } from "@/lib/listing";

/** Quick ticks on desktop are batched into one navigation after this pause. */
const COMMIT_DELAY_MS = 250;

interface ListingContextValue {
  /** What the controls show: the applied state plus changes not yet navigated. */
  state: ListingState;
  /** The state the current page was rendered for. */
  applied: ListingState;
  listing: Listing;
  basePath: string;
  /** True from the first change until the new page has rendered. */
  pending: boolean;
  /** Apply a change. `debounce` batches rapid changes (checkbox ticks) into one navigation. */
  dispatch: (action: ListingAction, options?: { debounce?: boolean }) => void;
  /** Navigate straight to a state (the mobile drawer's Apply). */
  navigate: (state: ListingState) => void;
}

const ListingContext = React.createContext<ListingContextValue | null>(null);

export function useListing(): ListingContextValue {
  const context = React.useContext(ListingContext);
  if (!context)
    throw new Error("useListing must be used inside <ListingProvider>");
  return context;
}

/**
 * Client-side controller of a listing page. The URL is the source of truth: every change
 * becomes a `router.push` inside a transition, the server renders the new page, and until then
 * the controls show the change at once (optimistic) while the results dim (`pending`).
 * Checkbox ticks are debounced, so three quick ticks cost one request, not three.
 */
export function ListingProvider({
  listing,
  applied,
  basePath,
  children,
}: {
  listing: Listing;
  applied: ListingState;
  basePath: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [navigating, startTransition] = React.useTransition();
  const [scheduled, setScheduled] = React.useState(false);
  // The draft belongs to the page it was made on. Every time a different page arrives
  // (navigation, back/forward — even back to an earlier URL) the generation moves on and the
  // controls show that page's state again. Reset during render, React's pattern for state
  // that follows a prop, so there's no extra effect-driven render.
  const appliedHref = listingHref(basePath, applied);
  const [page, setPage] = React.useState({ href: appliedHref, generation: 0 });
  const [local, setLocal] = React.useState({ generation: 0, draft: applied });
  let generation = page.generation;
  if (page.href !== appliedHref) {
    generation = page.generation + 1;
    setPage({ href: appliedHref, generation });
  }
  const draft = local.generation === generation ? local.draft : applied;
  // Latest draft for event handlers (written only in handlers, never during render).
  const latest = React.useRef({ generation: 0, draft: applied });

  const setDraft = React.useCallback(
    (next: ListingState) => {
      latest.current = { generation, draft: next };
      setLocal({ generation, draft: next });
    },
    [generation],
  );
  const currentDraft = React.useCallback(
    () =>
      latest.current.generation === generation ? latest.current.draft : applied,
    [generation, applied],
  );

  const navigate = React.useCallback(
    (next: ListingState) => {
      setScheduled(false);
      const href = listingHref(basePath, next);
      if (href === appliedHref) return;
      startTransition(() => router.push(href, { scroll: false }));
    },
    [appliedHref, basePath, router],
  );

  const commit = useDebouncedCallback(navigate, COMMIT_DELAY_MS);

  const dispatch = React.useCallback(
    (action: ListingAction, options?: { debounce?: boolean }) => {
      const next = listingReducer(currentDraft(), action);
      setDraft(next);
      if (options?.debounce) {
        setScheduled(true);
        commit(next);
      } else {
        commit.cancel();
        navigate(next);
      }
    },
    [commit, currentDraft, navigate, setDraft],
  );

  const value = React.useMemo<ListingContextValue>(
    () => ({
      state: draft,
      applied,
      listing,
      basePath,
      pending: navigating || scheduled,
      dispatch,
      navigate: (next) => {
        commit.cancel();
        setDraft(next);
        navigate(next);
      },
    }),
    [
      draft,
      applied,
      listing,
      basePath,
      navigating,
      scheduled,
      dispatch,
      commit,
      navigate,
      setDraft,
    ],
  );

  return (
    <ListingContext.Provider value={value}>{children}</ListingContext.Provider>
  );
}

/** Dims its children while a listing change is loading (instead of a skeleton). */
export function ListingResults({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  const { pending } = useListing();
  return (
    <div
      id={id}
      aria-busy={pending || undefined}
      data-pending={pending ? "" : undefined}
      className="min-w-0 transition-opacity duration-200 data-[pending]:opacity-60"
    >
      {children}
    </div>
  );
}
