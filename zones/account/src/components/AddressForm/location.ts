import type { ReverseGeocode } from "@/lib/api/types";
import { INDIAN_STATES } from "./indianStates";

/** Other spellings geocoders use for states and union territories. */
const STATE_ALIASES: Record<string, (typeof INDIAN_STATES)[number]> = {
  "national capital territory of delhi": "Delhi",
  "nct of delhi": "Delhi",
  "new delhi": "Delhi",
  orissa: "Odisha",
  pondicherry: "Puducherry",
  uttaranchal: "Uttarakhand",
  "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
};

const normalise = (value: string) =>
  value.trim().toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ");

/** The form's state option for a geocoder's state name, or "" when unknown. */
export function matchIndianState(name: string): string {
  const key = normalise(name);
  if (!key) return "";
  return (
    INDIAN_STATES.find((state) => normalise(state) === key) ??
    STATE_ALIASES[key] ??
    ""
  );
}

/** Address fields "Use my current location" can fill in. */
export const LOCATION_FIELDS = [
  "line1",
  "line2",
  "city",
  "state",
  "postalCode",
] as const;
export type LocationField = (typeof LOCATION_FIELDS)[number];

/**
 * The values to fill from a lookup: only fields the user hasn't typed into
 * (empty), and only values the form accepts. Never overwrites user input.
 */
export function locationFill(
  found: ReverseGeocode,
  current: Record<LocationField, string | undefined>,
): Partial<Record<LocationField, string>> {
  const candidates: Record<LocationField, string> = {
    line1: found.line1.slice(0, 128),
    line2: found.line2.slice(0, 128),
    city: found.city.slice(0, 64),
    state: matchIndianState(found.state),
    postalCode: /^\d{6}$/.test(found.postalCode) ? found.postalCode : "",
  };
  const fill: Partial<Record<LocationField, string>> = {};
  for (const field of LOCATION_FIELDS) {
    if (candidates[field] && !current[field]?.trim())
      fill[field] = candidates[field];
  }
  return fill;
}
