import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

const base = {
  title: "Adolph Sheesham Wood King Size Bed",
  href: "/products/adolph-bed",
  image: null,
  price: 32999,
  compareAtPrice: 66999,
  currency: "INR",
};

describe("ProductCard", () => {
  it("links the title to the product and shows the price with the saving", () => {
    render(<ProductCard {...base} as="div" />);
    expect(screen.getByRole("link", { name: base.title })).toHaveAttribute(
      "href",
      "/products/adolph-bed",
    );
    expect(screen.getByText("₹32,999")).toBeInTheDocument();
    expect(screen.getByText("₹66,999").tagName).toBe("S");
    expect(screen.getByText("51% Off")).toBeInTheDocument();
  });

  it("renders the optional Figma parts only when given", () => {
    const { rerender } = render(<ProductCard {...base} as="div" />);
    expect(screen.queryByRole("img", { name: /Rated/ })).toBeNull();
    expect(screen.queryByText("Ships in 2 Days")).toBeNull();

    rerender(
      <ProductCard
        {...base}
        as="div"
        badge="Bestseller"
        optionsLabel="1+ Options"
        rating={{ value: 4.5, count: 817 }}
        shippingNote="Ships in 2 Days"
      />,
    );
    expect(screen.getByText("Bestseller")).toBeInTheDocument();
    expect(screen.getByText("1+ Options")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rated 4.5 out of 5 from 817 ratings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ships in 2 Days")).toBeInTheDocument();
  });

  it("toggles the wishlist heart", () => {
    const onToggle = vi.fn();
    render(
      <ProductCard
        {...base}
        as="div"
        wishlist={{ saved: true, label: "Remove from wishlist", onToggle }}
      />,
    );
    const heart = screen.getByRole("button", { name: "Remove from wishlist" });
    expect(heart).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(heart);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
