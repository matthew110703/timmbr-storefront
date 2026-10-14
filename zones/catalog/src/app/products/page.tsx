import type { Metadata } from "next";
import { ListingPage, listingMetadata } from "@/components/Listing";
import type { SearchParams } from "@/lib/listing";

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  return listingMetadata({
    basePath: "/products",
    searchParams: await searchParams,
  });
}

/** All products, or search results with `?q=`. */
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Called directly (it is an async server component), so the page resolves in one step.
  return ListingPage({
    basePath: "/products",
    searchParams: await searchParams,
  });
}
