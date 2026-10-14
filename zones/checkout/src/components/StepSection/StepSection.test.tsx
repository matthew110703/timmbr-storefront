import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StepSection } from "./StepSection";

const original = window.matchMedia;

/** Pretends the viewport is (or is not) wide enough for the desktop layout. */
function viewport(desktop: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: desktop && query.includes("min-width"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = original;
});

const section = (open: boolean) => (
  <StepSection
    index={2}
    title="Delivery"
    summary="Sandesh · Chintamani"
    open={open}
    onOpenChange={() => {}}
  >
    <button>Continue</button>
  </StepSection>
);

describe("StepSection", () => {
  describe("on a phone", () => {
    it("is a button that announces whether the step is open", () => {
      viewport(false);
      const { rerender } = render(section(false));
      const header = screen.getByRole("button", { name: /Delivery/ });

      expect(header).toHaveAttribute("aria-expanded", "false");
      expect(header).toHaveAttribute("aria-controls");
      expect(screen.getByText("Sandesh · Chintamani")).toBeInTheDocument();

      rerender(section(true));
      expect(header).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.queryByText("Sandesh · Chintamani"),
      ).not.toBeInTheDocument();
    });

    it("moves focus to the header of a step that has just opened", () => {
      viewport(false);
      const { rerender } = render(section(false));
      expect(document.body).toHaveFocus();

      rerender(section(true));

      expect(screen.getByRole("button", { name: /Delivery/ })).toHaveFocus();
    });

    it("does not grab focus on first render, even when it starts open", () => {
      viewport(false);
      render(section(true));

      expect(document.body).toHaveFocus();
    });

    it("brings a step that opens off-screen into view, softly unless motion is reduced", () => {
      vi.useFakeTimers();
      viewport(false);
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
        top: 900,
      } as DOMRect);

      const { rerender } = render(section(false));
      rerender(section(true));
      vi.advanceTimersByTime(300);

      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
      vi.useRealTimers();
      vi.restoreAllMocks();
    });
  });

  describe("on desktop", () => {
    it("is just a title: not announced as collapsible and not a tab stop", () => {
      viewport(true);
      render(section(false));
      const header = screen.getByRole("button", { name: /Delivery/ });

      expect(header).not.toHaveAttribute("aria-expanded");
      expect(header).not.toHaveAttribute("aria-controls");
      expect(header).toHaveAttribute("tabindex", "-1");
    });

    it("never steals focus when its state changes", () => {
      viewport(true);
      const { rerender } = render(section(false));

      rerender(section(true));

      expect(document.body).toHaveFocus();
    });
  });
});
