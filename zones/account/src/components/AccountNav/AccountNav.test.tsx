import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/orders" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
const auth = vi.hoisted(() => ({ signOut: vi.fn(() => Promise.resolve()) }));
vi.mock("@timmbr/auth", () => auth);

import { AccountNav } from "./AccountNav";
import { strings } from "@/app/strings";

describe("AccountNav", () => {
  it("lists the account sections and marks the current one", () => {
    nav.pathname = "/orders/8f2a";
    render(<AccountNav />);

    expect(
      screen.getByRole("navigation", { name: strings.account.navLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: strings.account.nav.orders }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: strings.account.nav.addresses }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("link", { name: strings.account.nav.overview }),
    ).not.toHaveAttribute("aria-current");
  });

  it("starts with the overview, active on /account", () => {
    nav.pathname = "/";
    render(<AccountNav />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAccessibleName(strings.account.nav.overview);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[0]).toHaveAttribute("aria-current", "page");
  });

  it("links within the zone (basePath is added by next/link)", () => {
    nav.pathname = "/security";
    render(<AccountNav />);
    // next/link in tests renders the raw href
    expect(
      screen.getByRole("link", { name: strings.account.nav.security }),
    ).toHaveAttribute("href", "/security");
  });

  it("logs out through @timmbr/auth", async () => {
    render(<AccountNav />);
    fireEvent.click(
      screen.getByRole("button", { name: strings.account.logout }),
    );
    await waitFor(() => expect(auth.signOut).toHaveBeenCalledTimes(1));
  });
});
