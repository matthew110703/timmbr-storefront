import type { ReactNode } from "react";
import { cn } from "@timmbr/utils";

export interface CollapsePanelProps {
  open: boolean;
  /** Keep the panel open from `lg` up, whatever `open` says (sections that are steps on phones). */
  openOnDesktop?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Height-animated show/hide, in CSS only: the grid row eases between 0fr and 1fr, so no height
 * is measured and no JavaScript runs while it moves. It works on the server render, which also
 * means a panel that starts open is in the first paint.
 *
 * - Closed content is `invisible`, so it cannot be tabbed to or read out. Visibility is switched
 *   at the end of the close (and the start of the open) by the same transition.
 * - The DS turns every transition off when animations are disabled
 *   (`data-animations-disabled`), and `motion-reduce` does the same for a system that asks for
 *   less motion.
 */
export function CollapsePanel({
  open,
  openOnDesktop = false,
  id,
  className,
  children,
}: CollapsePanelProps) {
  return (
    <div
      id={id}
      data-open={open}
      className={cn(
        "grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
        open
          ? "visible grid-rows-[1fr] opacity-100"
          : "invisible grid-rows-[0fr] opacity-0",
        openOnDesktop && "lg:visible lg:grid-rows-[1fr] lg:opacity-100",
        className,
      )}
    >
      {/* Negative margin + padding keeps focus rings from being clipped by overflow-hidden. */}
      <div className="-m-1 min-h-0 overflow-hidden p-1">{children}</div>
    </div>
  );
}
