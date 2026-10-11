import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

const auth = vi.hoisted(() => ({ signOut: vi.fn(() => Promise.resolve()) }));
vi.mock("@timmbr/auth", () => auth);

import { AccountOverview } from "./AccountOverview";
import { strings } from "@/app/strings";

const o = strings.account.overview;
const summaries = {
  orders: o.orders(3, 1),
  wishlist: o.wishlist(4),
  addresses: o.addresses(2, "Bengaluru"),
  security: o.security(true, true),
};

describe("AccountOverview", () => {
  it("lists every section with its summary in the phone hub", () => {
    render(<AccountOverview summaries={summaries} />);
    const hub = within(
      screen.getByRole("navigation", { name: o.sectionsLabel }),
    );
    expect(
      hub.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["/orders", "/wishlist", "/addresses", "/security"]);
    expect(hub.getByRole("link", { name: /My orders/ })).toHaveTextContent(
      "3 orders · 1 awaiting payment",
    );
    expect(hub.getByRole("link", { name: /Addresses/ })).toHaveTextContent(
      "2 saved · default in Bengaluru",
    );
  });

  it("logs out from the hub", async () => {
    render(<AccountOverview summaries={summaries} />);
    fireEvent.click(
      screen.getByRole("button", { name: strings.account.logout }),
    );
    await waitFor(() => expect(auth.signOut).toHaveBeenCalledTimes(1));
  });
});

describe("overview summaries", () => {
  it.each([
    [o.orders(0, 0), "No orders yet"],
    [o.orders(1, 0), "1 order"],
    [o.wishlist(0), "Nothing saved yet"],
    [o.wishlist(1), "1 saved piece"],
    [o.addresses(0), "No saved addresses"],
    [o.addresses(1), "1 saved"],
    [o.security(false, false), "No password yet"],
    [o.security(true, true), "Password set · Google connected"],
  ])("%s", (actual, expected) => {
    expect(actual).toBe(expected);
  });
});
