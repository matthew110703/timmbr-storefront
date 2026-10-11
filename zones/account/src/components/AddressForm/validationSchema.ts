import { z } from "zod";
import { strings } from "@/app/strings";
import type { Address, AddressInput } from "@/lib/api/types";

const e = strings.addresses.form.errors;

/** Address labels offered in the form (core stores free text, default "home"). */
export const ADDRESS_LABELS = ["home", "work", "other"] as const;

/**
 * Mirrors timmbr-core's CreateAddressDto so mistakes show before the request:
 * names 2–64, phone `+91[6-9]XXXXXXXXX` (the user types the 10 digits), lines
 * up to 128, PIN 6 digits.
 */
export const addressSchema = z.object({
  fname: z.string().trim().min(2, e.firstName).max(64, e.tooLong(64)),
  lname: z.string().trim().min(2, e.lastName).max(64, e.tooLong(64)),
  phone: z
    .string()
    .trim()
    .transform((value) =>
      value.replace(/[\s-]/g, "").replace(/^(\+?91)(?=\d{10}$)/, ""),
    )
    .pipe(z.string().regex(/^[6-9]\d{9}$/, e.phone)),
  line1: z.string().trim().min(1, e.line1).max(128, e.tooLong(128)),
  line2: z.string().trim().max(128, e.tooLong(128)).optional(),
  city: z.string().trim().min(1, e.city).max(64, e.tooLong(64)),
  state: z.string().min(1, e.state),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, e.postalCode),
  label: z.enum(ADDRESS_LABELS),
  isDefault: z.boolean(),
  // Set by "Use my current location"; both or neither.
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
});

export type AddressFormInput = z.input<typeof addressSchema>;
export type AddressFormValues = z.output<typeof addressSchema>;

/** Form values → core's request body (country fixed to India, phone in E.164). */
export function toAddressInput(values: AddressFormValues): AddressInput {
  return {
    fname: values.fname,
    lname: values.lname,
    phone: `+91${values.phone}`,
    line1: values.line1,
    line2: values.line2 ? values.line2 : null,
    city: values.city,
    state: values.state,
    postalCode: values.postalCode,
    country: "India",
    label: values.label,
    // null clears a previously saved pin.
    latitude: values.latitude,
    longitude: values.longitude,
  };
}

/** A saved address → the form's initial values. */
export function toFormValues(address?: Address): AddressFormInput {
  const label = (ADDRESS_LABELS as readonly string[]).includes(
    address?.label ?? "",
  )
    ? (address!.label as AddressFormInput["label"])
    : "home";
  return {
    fname: address?.fname ?? "",
    lname: address?.lname ?? "",
    phone: address?.phone.replace(/^\+91/, "") ?? "",
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postalCode ?? "",
    label,
    isDefault: address?.isDefault ?? false,
    latitude: address?.latitude ?? null,
    longitude: address?.longitude ?? null,
  };
}
