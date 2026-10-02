import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductsPage from "./page";
import { strings } from "./strings";

describe("Products Zone Page", () => {
  it("renders the products app name heading from strings.ts", () => {
    render(<ProductsPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.appName)).toBeInTheDocument();
  });
});
