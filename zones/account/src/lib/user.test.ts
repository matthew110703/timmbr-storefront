import { describe, expect, it } from "vitest";
import { isPlaceholderEmail, itemTitle, primaryContact } from "./user";

describe("user display helpers", () => {
  it("recognises core's placeholder email for phone sign-ups", () => {
    expect(isPlaceholderEmail("919000000019@phone.timmbr.com")).toBe(true);
    expect(isPlaceholderEmail("arul@example.com")).toBe(false);
  });

  it("shows the phone instead of a placeholder email", () => {
    expect(
      primaryContact({
        email: "919000000019@phone.timmbr.com",
        phone: "+919000000019",
      }),
    ).toBe("+919000000019");
    expect(primaryContact({ email: "arul@example.com", phone: null })).toBe(
      "arul@example.com",
    );
  });

  it("drops the SKU suffix from snapshotted item names", () => {
    expect(itemTitle("Kyoto Bed - BED-KYOTO-WAL-QN", "BED-KYOTO-WAL-QN")).toBe(
      "Kyoto Bed",
    );
    expect(itemTitle("Plain name", "SKU-1")).toBe("Plain name");
  });
});
