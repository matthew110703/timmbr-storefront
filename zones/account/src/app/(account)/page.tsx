import type { Metadata } from "next";
import { AccountOverview } from "@/components/AccountOverview";
import { countOrders, getWishlist, listAddresses } from "@/lib/api/account";
import { requireUser } from "@/lib/session";
import { strings } from "@/app/strings";

export const metadata: Metadata = {
  title: `${strings.account.title} | timmbr`,
};

const o = strings.account.overview;

/** /account: the overview (phones: the hub of account sections). */
export default async function AccountOverviewPage() {
  const [user, orders, pending, wishlist, addresses] = await Promise.all([
    requireUser(),
    countOrders(),
    countOrders(["PENDING"]),
    getWishlist(),
    listAddresses(),
  ]);
  const defaultAddress = addresses.find((address) => address.isDefault);

  return (
    <AccountOverview
      summaries={{
        orders: o.orders(orders, pending),
        wishlist: o.wishlist(wishlist.itemCount),
        addresses: o.addresses(addresses.length, defaultAddress?.city),
        security: o.security(
          user.hasPassword,
          user.linkedProviders.includes("GOOGLE"),
        ),
      }}
    />
  );
}
