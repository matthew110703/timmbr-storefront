import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductsPage from "./page";
import { strings } from "./strings";

describe("Products page", () => {
  it("renders the products heading from strings.ts", () => {
    render(<ProductsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: strings.title }),
    ).toBeInTheDocument();
  });
});
