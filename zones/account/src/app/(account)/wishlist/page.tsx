import type { Metadata } from "next";
import { WishlistGrid } from "@/components/WishlistGrid";
import { getWishlist } from "@/lib/api/account";
import { strings } from "@/app/strings";

export const metadata: Metadata = {
  title: `${strings.wishlist.title} | timmbr`,
};

export default async function WishlistPage() {
  const wishlist = await getWishlist();
  return <WishlistGrid items={wishlist.items} />;
}
