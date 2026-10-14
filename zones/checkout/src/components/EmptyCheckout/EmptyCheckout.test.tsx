import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { strings } from "@/app/strings";
import { EmptyCheckout } from "./EmptyCheckout";

describe("EmptyCheckout", () => {
  it("says the cart is empty and links back to the store", () => {
    render(<EmptyCheckout />);

    expect(screen.getByText(strings.empty.title)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: strings.empty.cta }),
    ).toHaveAttribute("href", strings.empty.ctaHref);
  });

  it("is centred on the page, not left in a narrow box", () => {
    const { container } = render(<EmptyCheckout />);

    expect(container.firstElementChild?.className).toContain("justify-center");
  });
});
