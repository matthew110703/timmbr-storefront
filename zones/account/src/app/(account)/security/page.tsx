import type { Metadata } from "next";
import { SecuritySections } from "@/components/SecuritySections";
import { requireUser } from "@/lib/session";
import { strings } from "@/app/strings";

export const metadata: Metadata = {
  title: `${strings.security.title} | timmbr`,
};

export default async function SecurityPage() {
  // Shared with the layout's call (cached per request).
  const user = await requireUser();
  return <SecuritySections user={user} />;
}
