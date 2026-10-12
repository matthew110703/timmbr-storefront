import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CategoryPage from "./page";
import { strings } from "./strings";

describe("Category page", () => {
  it("renders the category heading and the slug", async () => {
    render(
      await CategoryPage({ params: Promise.resolve({ slug: "living-room" }) }),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: strings.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("living-room")).toBeInTheDocument();
  });
});
