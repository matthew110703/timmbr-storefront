import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AuthPage from "./page";
import { strings } from "./strings";

describe("Auth Zone Page", () => {
  it("renders the auth app name heading from strings.ts", () => {
    render(<AuthPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.appName)).toBeInTheDocument();
  });
});
