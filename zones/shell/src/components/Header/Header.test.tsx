import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { strings } from "@/app/strings";

describe("Header", () => {
  it("renders branding with logo and mini logo", () => {
    render(<Header />);
    const logos = screen.getAllByAltText(strings.branding.logoAlt);
    expect(logos.length).toBeGreaterThan(0);
    expect(logos[0]).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(<Header />);
    for (const item of strings.header.navItems) {
      const navLinks = screen.getAllByText(item.label);
      expect(navLinks.length).toBeGreaterThan(0);
      expect(navLinks[0]).toBeInTheDocument();
    }
  });

  it("renders action buttons for profile and cart", () => {
    render(<Header />);
    const profileLinks = screen.getAllByRole("link", {
      name: strings.header.actions.profile.ariaLabel,
    });
    expect(profileLinks.length).toBeGreaterThan(0);
    expect(profileLinks[0]).toBeInTheDocument();

    const cartLinks = screen.getAllByRole("link", {
      name: strings.header.actions.cart.ariaLabel,
    });
    expect(cartLinks.length).toBeGreaterThan(0);
    expect(cartLinks[0]).toBeInTheDocument();
  });
});
