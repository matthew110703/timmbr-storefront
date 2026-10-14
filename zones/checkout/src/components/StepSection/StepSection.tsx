"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Card, Icon, Text } from "@timmbr/ui";
import { Check, ChevronDown } from "@timmbr/icons";
import { cn } from "@timmbr/utils";
import { CollapsePanel } from "@/components/CollapsePanel";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/media";

/** Roughly how long the step above takes to fold away before this one is scrolled to. */
const COLLAPSE_MS = 220;
/** The sticky header is about this tall; a step whose top is above it is partly hidden. */
const HEADER_OFFSET = 72;

export interface StepSectionProps {
  /** Position on phones, where the sections are steps (1, 2, 3). */
  index: number;
  title: string;
  /** A live count shown beside the title (e.g. items in the cart). */
  count?: number;
  /** Accessible text for the count ("3 items"). */
  countLabel?: string;
  /** What is chosen so far, shown on phones while the step is closed. */
  summary?: ReactNode;
  open: boolean;
  /** The step has what it needs (shows a tick instead of its number). */
  done?: boolean;
  onOpenChange: (open: boolean) => void;
  testId?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A checkout section. On phones it is a collapsible step: closed it shows a one-line summary
 * and an edit affordance, so the page stays short; opening it moves focus to its header and
 * brings it into view. From `lg` up every section is always open and the header is just a title
 * (not focusable, no expanded state announced).
 */
export function StepSection({
  index,
  title,
  count,
  countLabel,
  summary,
  open,
  done = false,
  onOpenChange,
  testId,
  className,
  children,
}: StepSectionProps) {
  const bodyId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(open);
  const desktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  // A step that has just been opened (a "Continue" button folded the previous one away, taking
  // the focused button with it): focus its header and bring it into view.
  useEffect(() => {
    const justOpened = open && !wasOpen.current;
    wasOpen.current = open;
    if (!justOpened || desktop) return;

    headerRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(
      () => {
        const card = cardRef.current;
        if (!card?.scrollIntoView) return;
        const top = card.getBoundingClientRect().top;
        if (top < HEADER_OFFSET || top > window.innerHeight * 0.5) {
          card.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      },
      reducedMotion ? 0 : COLLAPSE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open, desktop, reducedMotion]);

  return (
    <Card
      ref={cardRef}
      variant="subtle"
      padding="none"
      data-testid={testId}
      data-open={open}
      className={cn("scroll-mt-20 overflow-hidden", className)}
    >
      <h2 className="m-0">
        <button
          ref={headerRef}
          type="button"
          // On desktop the header is only a title: nothing to expand, nothing to tab to.
          aria-expanded={desktop ? undefined : open}
          aria-controls={desktop ? undefined : bodyId}
          tabIndex={desktop ? -1 : undefined}
          onClick={() => onOpenChange(!open)}
          className="flex w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:pointer-events-none lg:px-5"
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-body-3 font-semibold transition-colors duration-200 motion-reduce:transition-none lg:hidden",
              done
                ? "bg-primary text-grey-50"
                : "border border-grey-300 text-foreground",
            )}
          >
            {done ? (
              <Icon size="sm">
                <Check />
              </Icon>
            ) : (
              index
            )}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-2">
              <Text variant="body-1" weight="semibold">
                {title}
              </Text>
              {count !== undefined && (
                <span
                  aria-label={countLabel}
                  data-testid={`${testId}-count`}
                  className="inline-flex min-w-6 items-center justify-center rounded-full bg-bg-subtle px-2 py-0.5 text-body-3 font-semibold"
                >
                  {count}
                </span>
              )}
            </span>
            {!open && summary && (
              <Text
                variant="body-3"
                foreground="muted"
                className="truncate lg:hidden"
              >
                {summary}
              </Text>
            )}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none lg:hidden",
              open && "rotate-180",
            )}
          >
            <Icon size="sm">
              <ChevronDown />
            </Icon>
          </span>
        </button>
      </h2>
      <CollapsePanel id={bodyId} open={open} openOnDesktop>
        <div className="px-4 pb-4 lg:px-5 lg:pb-5">{children}</div>
      </CollapsePanel>
    </Card>
  );
}
