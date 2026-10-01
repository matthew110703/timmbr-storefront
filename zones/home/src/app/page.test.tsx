import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./page";
import { strings } from "./strings";

describe("Home Zone HomePage", () => {
  it("renders the app name heading from strings.ts", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.appName)).toBeInTheDocument();
  });
});
