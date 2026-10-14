import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { strings } from "@/app/strings";
import { makeLine } from "@/test/fixtures";
import { CartLineCard } from "./CartLineCard";

const setup = (line = makeLine(), busy = false) => {
  const handlers = {
    onQuantityChange: vi.fn(),
    onRemove: vi.fn(),
    onSaveForLater: vi.fn(),
  };
  render(<CartLineCard line={line} busy={busy} {...handlers} />);
  return { line, ...handlers };
};

describe("CartLineCard", () => {
  it("shows the name, options and the line total", () => {
    setup(makeLine({ quantity: 2, totalPrice: "39998" }));

    expect(screen.getByText("Herrin Boucle Barrel Chair")).toBeInTheDocument();
    expect(screen.getByText("Ivory")).toBeInTheDocument();
    expect(screen.getByText("₹39,998")).toBeInTheDocument();
  });

  it("changes the quantity with the + and - buttons", () => {
    const { line, onQuantityChange } = setup(makeLine({ quantity: 2 }));

    fireEvent.click(
      screen.getByRole("button", { name: strings.cart.quantity.increase }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: strings.cart.quantity.decrease }),
    );

    expect(onQuantityChange).toHaveBeenNthCalledWith(1, line, 3);
    expect(onQuantityChange).toHaveBeenNthCalledWith(2, line, 1);
  });

  it("stops at the stock left", () => {
    setup(makeLine({ quantity: 3, availableQuantity: 3 }));

    expect(
      screen.getByRole("button", { name: strings.cart.quantity.increase }),
    ).toBeDisabled();
    expect(screen.getByText(strings.cart.onlyLeft(3))).toBeInTheDocument();
  });

  it("saves for later and removes", () => {
    const { line, onSaveForLater, onRemove } = setup();

    fireEvent.click(
      screen.getByRole("button", {
        name: strings.cart.saveForLaterAria(line.name),
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: strings.cart.removeAria(line.name) }),
    );

    expect(onSaveForLater).toHaveBeenCalledWith(line);
    expect(onRemove).toHaveBeenCalledWith(line);
  });

  it("marks itself busy while the cart is changing, without disabling what the shopper is focused on", () => {
    setup(makeLine(), true);

    expect(screen.getByTestId("cart-line")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      screen.getByRole("button", { name: strings.cart.quantity.increase }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", {
        name: strings.cart.saveForLaterAria("Herrin Boucle Barrel Chair"),
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", {
        name: strings.cart.removeAria("Herrin Boucle Barrel Chair"),
      }),
    ).toBeEnabled();
  });

  it("says when a line can no longer be bought, but still lets it go", () => {
    const { line } = setup(makeLine({ isAvailable: false }));

    expect(screen.getByText(strings.cart.unavailable)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: strings.cart.quantity.increase }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: strings.cart.removeAria(line.name) }),
    ).toBeEnabled();
  });
});
