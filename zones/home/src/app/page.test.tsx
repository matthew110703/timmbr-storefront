import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductHomePage from "./page";
import { strings } from "./strings";

describe("Home Zone ProductHomePage", () => {
  it("renders the hero heading and badge from strings.ts", () => {
    render(<ProductHomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.hero.badge)).toBeInTheDocument();
    expect(screen.getByText(strings.hero.primaryCta)).toBeInTheDocument();
  });

  it("renders the 4 craftsmanship value propositions", () => {
    render(<ProductHomePage />);
    expect(
      screen.getByText(strings.valueProps.sustainability.title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(strings.valueProps.joinery.title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(strings.valueProps.finishes.title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(strings.valueProps.warranty.title),
    ).toBeInTheDocument();
  });

  it("renders curated room categories", () => {
    render(<ProductHomePage />);
    expect(
      screen.getByRole("heading", { name: strings.featuredCategories.title }),
    ).toBeInTheDocument();
    for (const cat of strings.featuredCategories.categories) {
      expect(screen.getByText(cat.name)).toBeInTheDocument();
    }
  });

  it("displays the Port 3001 zone badge", () => {
    render(<ProductHomePage />);
    expect(screen.getByText(strings.zoneBadge.zoneName)).toBeInTheDocument();
    expect(screen.getByText(strings.zoneBadge.portLabel)).toBeInTheDocument();
  });
});
