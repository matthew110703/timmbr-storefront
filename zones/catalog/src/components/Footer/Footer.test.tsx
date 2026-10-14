import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

const categories = [
  { id: "1", name: "Bedroom", slug: "bedroom", logoUrl: null, children: [] },
  {
    id: "2",
    name: "Living Room",
    slug: "living-room",
    logoUrl: null,
    children: [],
  },
];

describe("Footer", () => {
  it("lists the categories in Shop and keeps the shell's sections", () => {
    render(<Footer categories={categories} />);
    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: "Bedroom" }),
    ).toHaveAttribute("href", "/category/bedroom");
    expect(
      within(footer).getByRole("link", { name: "Our materials" }),
    ).toHaveAttribute("href", "/craft/materials");
  });

  it("sends links outside the catalog to the shell with a full page load", () => {
    render(<Footer categories={categories} />);
    expect(screen.getByRole("link", { name: "Our materials" })).toHaveAttribute(
      "data-cross-zone",
      "true",
    );
    expect(screen.getByRole("link", { name: "Bedroom" })).not.toHaveAttribute(
      "data-cross-zone",
    );
  });

  it("hides Shop when there are no categories", () => {
    render(<Footer />);
    expect(screen.queryByText("Shop")).not.toBeInTheDocument();
  });
});
