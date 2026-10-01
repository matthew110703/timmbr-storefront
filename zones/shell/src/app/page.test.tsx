import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./page";
import { strings } from "./strings";

describe("Shell HomePage", () => {
  it("renders the main heading from strings.ts", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.hero.title)).toBeInTheDocument();
  });

  it("renders health check probe action link", () => {
    render(<HomePage />);
    const probeLink = screen.getByRole("link", { name: strings.hero.ctaProbe });
    expect(probeLink).toBeInTheDocument();
    expect(probeLink).toHaveAttribute("href", "/health");
  });

  it("displays the port 3000 control plane card", () => {
    render(<HomePage />);
    expect(screen.getByText(strings.controlPlaneCard.name)).toBeInTheDocument();
    expect(
      screen.getByText(strings.controlPlaneCard.portValue),
    ).toBeInTheDocument();
  });
});
