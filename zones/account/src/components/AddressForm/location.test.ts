import { describe, expect, it } from "vitest";
import { locationFill, matchIndianState } from "./location";

const found = {
  line1: "12 100 Feet Road",
  line2: "Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560038",
  country: "India",
  latitude: 12.97,
  longitude: 77.64,
  formatted: "",
};

describe("matchIndianState", () => {
  it.each([
    ["Karnataka", "Karnataka"],
    ["  tamil nadu ", "Tamil Nadu"],
    ["Jammu & Kashmir", "Jammu and Kashmir"],
    ["National Capital Territory of Delhi", "Delhi"],
    ["Orissa", "Odisha"],
    ["Bavaria", ""],
    ["", ""],
  ])("%s → %s", (name, expected) => {
    expect(matchIndianState(name)).toBe(expected);
  });
});

describe("locationFill", () => {
  const empty = { line1: "", line2: "", city: "", state: "", postalCode: "" };

  it("fills every empty field it has a value for", () => {
    expect(locationFill(found, empty)).toEqual({
      line1: "12 100 Feet Road",
      line2: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
    });
  });

  it("never overwrites what the user typed", () => {
    const fill = locationFill(found, {
      ...empty,
      line1: "Flat 4B, Lake View",
      city: "Bangalore",
    });
    expect(fill).not.toHaveProperty("line1");
    expect(fill).not.toHaveProperty("city");
    expect(fill.postalCode).toBe("560038");
  });

  it("skips values the form wouldn't accept", () => {
    const fill = locationFill(
      { ...found, state: "Somewhere", postalCode: "5600", line2: "" },
      empty,
    );
    expect(fill).not.toHaveProperty("state");
    expect(fill).not.toHaveProperty("postalCode");
    expect(fill).not.toHaveProperty("line2");
  });
});
