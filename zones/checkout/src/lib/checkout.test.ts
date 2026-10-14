import { describe, expect, it } from "vitest";
import { makeAddress, makeLine } from "@/test/fixtures";
import {
  addressName,
  addressText,
  payableLines,
  pickInitialAddress,
  toCheckoutItems,
} from "./checkout";

describe("payableLines / toCheckoutItems", () => {
  const ok = makeLine({ id: "a", variantId: "va", quantity: 2 });
  const withdrawn = makeLine({ id: "b", variantId: "vb", isAvailable: false });
  const soldOut = makeLine({ id: "c", variantId: "vc", availableQuantity: 0 });

  it("drops lines that cannot be bought", () => {
    expect(payableLines([ok, withdrawn, soldOut])).toEqual([ok]);
  });

  it("sends only variant and quantity to core", () => {
    expect(toCheckoutItems([ok, withdrawn])).toEqual([
      { variantId: "va", quantity: 2 },
    ]);
  });
});

describe("pickInitialAddress", () => {
  it("prefers the default address", () => {
    const first = makeAddress({ id: "1", isDefault: false });
    const def = makeAddress({ id: "2", isDefault: true });
    expect(pickInitialAddress([first, def])).toBe(def);
  });

  it("falls back to the first address, or none", () => {
    const first = makeAddress({ id: "1", isDefault: false });
    expect(pickInitialAddress([first])).toBe(first);
    expect(pickInitialAddress([])).toBeNull();
  });
});

describe("address text", () => {
  it("joins the filled lines", () => {
    expect(addressText(makeAddress())).toBe(
      "Deccan Hospital Dead End Road, Chintamani, Karnataka, 563125",
    );
    expect(addressText(makeAddress({ line2: "Flat 4" }))).toContain(
      "Flat 4, Chintamani",
    );
  });

  it("builds the full name", () => {
    expect(addressName(makeAddress())).toBe("Sandesh Rao");
    expect(addressName(makeAddress({ lname: "" }))).toBe("Sandesh");
  });
});
