import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";
import { strings } from "@/app/strings";

const categories = [
  { id: "1", name: "Bedroom", slug: "bedroom", children: [] },
  { id: "2", name: "Living Room", slug: "living-room", children: [] },
];

// NavFooter renders each section twice (desktop columns + mobile accordion).
describe("Footer", () => {
  it("lists the root categories under Shop as full-navigation links", () => {
    render(<Footer categories={categories} />);
    expect(
      screen.getAllByText(strings.footer.shopTitle).length,
    ).toBeGreaterThan(0);
    const [link] = screen.getAllByRole("link", { name: "Living Room" });
    expect(link).toHaveAttribute("href", "/category/living-room");
    expect(link).toHaveAttribute("data-cross-zone", "true");
  });

  it("hides the Shop section when there are no categories", () => {
    render(<Footer />);
    expect(
      screen.queryByText(strings.footer.shopTitle),
    ).not.toBeInTheDocument();
    // The other sections still render
    expect(
      screen.getAllByText(strings.footer.sections[0].title).length,
    ).toBeGreaterThan(0);
  });
});
