import type { Metadata } from "next";
import { AddressList } from "@/components/AddressList";
import { listAddresses } from "@/lib/api/account";
import { strings } from "@/app/strings";

export const metadata: Metadata = {
  title: `${strings.addresses.title} | timmbr`,
};

export default async function AddressesPage() {
  const addresses = await listAddresses();
  return <AddressList addresses={addresses} />;
}
