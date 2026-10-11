import type { UserProfile } from "@/lib/api/types";

/**
 * Phone sign-ups get a placeholder email from timmbr-core
 * (`<digits>@phone.timmbr.com`) until email becomes optional. It isn't a real
 * address, so never show it to the user.
 */
export function isPlaceholderEmail(email: string | null | undefined): boolean {
  return !email || /@phone\.timmbr\.com$/i.test(email);
}

/** The contact to show for the user: their real email, else their phone. */
export function primaryContact(
  user: Pick<UserProfile, "email" | "phone">,
): string {
  return isPlaceholderEmail(user.email) ? (user.phone ?? "") : user.email;
}

/**
 * Order item names are snapshotted as "<product> - <SKU>". The SKU is shown
 * on its own line, so drop it from the title.
 */
export function itemTitle(name: string, sku: string): string {
  const suffix = ` - ${sku}`;
  return name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
}
