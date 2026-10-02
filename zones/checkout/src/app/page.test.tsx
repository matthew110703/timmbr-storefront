import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CheckoutPage from "./page";
import { strings } from "./strings";

describe("Checkout Zone Page", () => {
  it("renders the checkout app name heading from strings.ts", () => {
    render(<CheckoutPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(strings.appName)).toBeInTheDocument();
  });
});
