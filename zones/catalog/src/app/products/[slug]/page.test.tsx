import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductPage from "./page";
import { strings } from "./strings";

describe("Product page", () => {
  it("renders the product heading and the slug", async () => {
    render(
      await ProductPage({ params: Promise.resolve({ slug: "teak-chair" }) }),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: strings.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("teak-chair")).toBeInTheDocument();
  });
});
