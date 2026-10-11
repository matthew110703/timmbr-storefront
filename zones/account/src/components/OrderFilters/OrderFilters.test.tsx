import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

import { OrderFilters, orderFilterHref } from "./OrderFilters";
import { strings } from "@/app/strings";

const f = strings.orders.filters;

describe("OrderFilters", () => {
  it("renders the status filters as tabs with the current one selected", () => {
    render(<OrderFilters active="delivered" />);
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      f.all,
      f.pending,
      f.active,
      f.delivered,
      f.closed,
    ]);
    expect(screen.getByRole("tab", { name: f.delivered })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("navigates to the filter's URL", () => {
    render(<OrderFilters active="all" />);
    const tab = screen.getByRole("tab", { name: f.pending });
    // Radix activates tabs on mousedown (left button).
    fireEvent.mouseDown(tab, { button: 0 });
    expect(router.push).toHaveBeenCalledWith("/orders?status=pending", {
      scroll: false,
    });
  });

  it("builds shareable URLs", () => {
    expect(orderFilterHref("all")).toBe("/orders");
    expect(orderFilterHref("closed")).toBe("/orders?status=closed");
  });
});
