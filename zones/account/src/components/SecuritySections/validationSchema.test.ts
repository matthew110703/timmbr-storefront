import { describe, expect, it } from "vitest";
import {
  createPasswordSchema,
  nameSchema,
  passwordSchema,
} from "./validationSchema";

describe("passwordSchema", () => {
  const base = {
    currentPassword: "Old#1234",
    newPassword: "New#12345",
    confirmPassword: "New#12345",
  };

  it("accepts a strong new password that matches its confirmation", () => {
    expect(passwordSchema.safeParse(base).success).toBe(true);
  });

  it.each(["short1#A", "nouppercase1#", "NoNumber#", "NoSymbol123"])(
    "rejects a weak password (%s)",
    (pw) => {
      const result = passwordSchema.safeParse({
        ...base,
        newPassword: pw,
        confirmPassword: pw,
      });
      expect(result.success).toBe(pw === "short1#A");
    },
  );

  it("flags a mismatched confirmation on that field", () => {
    const result = passwordSchema.safeParse({
      ...base,
      confirmPassword: "Different#1",
    });
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("requires the current password", () => {
    expect(
      passwordSchema.safeParse({ ...base, currentPassword: "" }).success,
    ).toBe(false);
  });
});

describe("nameSchema", () => {
  it.each([
    ["Arul Raj", true],
    ["  Al  ", false],
    ["x".repeat(65), false],
  ])("%s → %s", (name, ok) => {
    expect(nameSchema.safeParse({ name }).success).toBe(ok);
  });
});

describe("createPasswordSchema", () => {
  const base = {
    code: "123456",
    newPassword: "New#12345",
    confirmPassword: "New#12345",
  };

  it("accepts the 6-digit code with a strong, confirmed password", () => {
    expect(createPasswordSchema.safeParse(base).success).toBe(true);
  });

  it.each(["12345", "12345a", ""])("rejects the code %j", (code) => {
    const result = createPasswordSchema.safeParse({ ...base, code });
    expect(result.error?.issues[0]?.path).toEqual(["code"]);
  });

  it("flags a mismatched confirmation", () => {
    const result = createPasswordSchema.safeParse({
      ...base,
      confirmPassword: "Other#12345",
    });
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });
});
