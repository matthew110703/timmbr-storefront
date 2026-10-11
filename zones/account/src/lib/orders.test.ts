import { describe, expect, it } from "vitest";
import {
  ORDER_FILTERS,
  orderNumber,
  orderStatusDisplay,
  orderTracker,
  parseOrderFilter,
  paymentStatusDisplay,
} from "./orders";

describe("order helpers", () => {
  it("shortens the order id into a readable number", () => {
    expect(orderNumber("8f2a91c3-77b0-4e2a-9c1d-000000000000")).toBe(
      "8F2A91C3",
    );
  });

  it("parses the filter from the query, defaulting to all", () => {
    expect(parseOrderFilter("active")).toBe("active");
    expect(parseOrderFilter(["closed", "x"])).toBe("closed");
    expect(parseOrderFilter("nope")).toBe("all");
    expect(parseOrderFilter(undefined)).toBe("all");
    expect(ORDER_FILTERS.active).toEqual([
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
    ]);
  });

  it.each([
    ["PENDING", "warning"],
    ["SHIPPED", "info"],
    ["DELIVERED", "success"],
    ["CANCELLED", "subtle"],
  ] as const)("maps order status %s to the %s tone", (status, tone) => {
    expect(orderStatusDisplay(status).tone).toBe(tone);
    expect(orderStatusDisplay(status).label).toBeTruthy();
  });

  it("maps payment statuses", () => {
    expect(paymentStatusDisplay("PAID")).toEqual({
      label: "Paid",
      tone: "success",
    });
    expect(paymentStatusDisplay("FAILED").tone).toBe("destructive");
  });

  it.each([
    ["PENDING", 0, false, 4],
    ["PROCESSING", 1, false, 4],
    ["SHIPPED", 2, false, 4],
    ["DELIVERED", 4, false, 4],
    ["CANCELLED", 1, true, 2],
    ["RETURNED", 4, true, 5],
  ] as const)(
    "tracker for %s: current %i, failed %s, %i steps",
    (status, current, failed, count) => {
      const tracker = orderTracker(status);
      expect(tracker.current).toBe(current);
      expect(tracker.failed).toBe(failed);
      expect(tracker.steps).toHaveLength(count);
    },
  );
});
