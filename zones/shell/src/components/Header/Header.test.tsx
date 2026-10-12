import React from "react";
import { describe, it, expect } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { strings } from "@/app/strings";
import { clearSession, DEFAULT_AUTH_MESSAGES, setSignedIn } from "@timmbr/auth";

describe("Header", () => {
  it("renders branding with logo and mini logo", () => {
    render(<Header />);
    const logos = screen.getAllByAltText(strings.branding.logoAlt);
    expect(logos.length).toBeGreaterThan(0);
    expect(logos[0]).toBeInTheDocument();
  });

  it("renders the root categories as navigation items", () => {
    const categories = [
      { id: "1", name: "Bedroom", slug: "bedroom", children: [] },
      {
        id: "2",
        name: "Living Room",
        slug: "living-room",
        children: [{ id: "3", name: "Sofas", slug: "sofas", children: [] }],
      },
    ];
    render(<Header categories={categories} />);
    // Every root opens a menu (labels are never links)
    expect(
      screen.queryByRole("link", { name: "Bedroom" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Bedroom" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: "Living Room" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders action buttons for profile and cart", () => {
    render(<Header />);
    const profileActions = screen.getAllByLabelText(
      DEFAULT_AUTH_MESSAGES.profile.loginAriaLabel,
    );
    expect(profileActions.length).toBeGreaterThan(0);
    expect(profileActions[0]).toBeInTheDocument();

    const cartLinks = screen.getAllByRole("link", {
      name: strings.header.actions.cart.ariaLabel,
    });
    expect(cartLinks.length).toBeGreaterThan(0);
    expect(cartLinks[0]).toBeInTheDocument();
  });

  it("shows the user's first name linking to /account once signed in", () => {
    act(() => {
      setSignedIn({
        id: "u1",
        name: "Daenerys Targaryen",
        email: "dany@example.com",
        role: "USER",
      });
    });
    render(<Header />);

    const accountLinks = screen.getAllByRole("link", {
      name: DEFAULT_AUTH_MESSAGES.profile.accountAriaLabel(
        "Daenerys Targaryen",
      ),
    });
    expect(accountLinks[0]).toHaveAttribute("href", "/account");
    expect(screen.getAllByText("Daenerys").length).toBeGreaterThan(0);

    act(() => clearSession());
  });
});
