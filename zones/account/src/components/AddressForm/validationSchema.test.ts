import { describe, expect, it } from "vitest";
import {
  addressSchema,
  toAddressInput,
  toFormValues,
} from "./validationSchema";

const valid = {
  fname: "Arul",
  lname: "Raj",
  phone: "98765 43210",
  line1: "12 Temple Street",
  line2: "",
  city: "Chennai",
  state: "Tamil Nadu",
  postalCode: "600001",
  label: "home" as const,
  isDefault: false,
  latitude: null,
  longitude: null,
};

describe("addressSchema", () => {
  it("accepts a valid address and normalises the phone", () => {
    const parsed = addressSchema.parse(valid);
    expect(parsed.phone).toBe("9876543210");
  });

  it.each(["+91 98765 43210", "919876543210", "9876543210"])(
    "accepts phone written as %s",
    (phone) => {
      expect(addressSchema.parse({ ...valid, phone }).phone).toBe("9876543210");
    },
  );

  it.each([
    ["phone", "12345"],
    ["phone", "5876543210"],
    ["postalCode", "6000"],
    ["fname", "A"],
    ["state", ""],
    ["line1", ""],
  ])("rejects an invalid %s (%s)", (field, value) => {
    const result = addressSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path[0]).toBe(field);
  });
});

describe("address mapping", () => {
  it("builds core's request: +91 phone, India, null empty line 2", () => {
    const input = toAddressInput(addressSchema.parse(valid));
    expect(input).toMatchObject({
      phone: "+919876543210",
      country: "India",
      line2: null,
      label: "home",
    });
    // No pin: null (also clears one saved before).
    expect(input).toMatchObject({ latitude: null, longitude: null });
  });

  it('sends the pin from "Use my current location"', () => {
    const input = toAddressInput(
      addressSchema.parse({ ...valid, latitude: 12.9716, longitude: 77.5946 }),
    );
    expect(input).toMatchObject({ latitude: 12.9716, longitude: 77.5946 });
  });

  it("rejects an out-of-range pin", () => {
    expect(
      addressSchema.safeParse({ ...valid, latitude: 120, longitude: 77 })
        .success,
    ).toBe(false);
  });

  it("prefills the form from a saved address", () => {
    const values = toFormValues({
      id: "a1",
      fname: "Arul",
      lname: "Raj",
      phone: "+919876543210",
      line1: "12 Temple Street",
      line2: null,
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600001",
      country: "India",
      type: "SHIPPING",
      label: "Work",
      isDefault: true,
      latitude: 13.08,
      longitude: 80.27,
    });
    expect(values).toMatchObject({
      phone: "9876543210",
      line2: "",
      label: "home",
      isDefault: true,
    });
    expect(values).toMatchObject({ latitude: 13.08, longitude: 80.27 });
  });
});
