import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ShellPage from "./page";
import { strings } from "./strings";

describe("Shell Root Page", () => {
  it("renders the app name heading from strings.ts", () => {
    render(<ShellPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.appName)).toBeInTheDocument();
  });
});
