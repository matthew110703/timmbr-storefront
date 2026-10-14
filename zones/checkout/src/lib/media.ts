import { useSyncExternalStore } from "react";

/** The breakpoint where the checkout stops being steps and shows everything (Tailwind `lg`). */
const DESKTOP = "(min-width: 1024px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function matchMediaStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    getSnapshot: () => window.matchMedia(query).matches,
  };
}

const desktop = matchMediaStore(DESKTOP);
const reducedMotion = matchMediaStore(REDUCED_MOTION);

/**
 * True from the `lg` breakpoint up. The server (and the first client render) answer false, so
 * hydration always matches; the real value follows straight after.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    desktop.subscribe,
    desktop.getSnapshot,
    () => false,
  );
}

/** The visitor asked their system for less motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    reducedMotion.subscribe,
    reducedMotion.getSnapshot,
    () => false,
  );
}
