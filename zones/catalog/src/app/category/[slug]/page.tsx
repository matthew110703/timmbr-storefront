import type { Metadata } from "next";
import { ListingPage, listingMetadata } from "@/components/Listing";
import type { SearchParams } from "@/lib/listing";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

async function propsOf({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  return { basePath: `/category/${slug}`, category: slug, searchParams: query };
}

export async function generateMetadata(
  props: CategoryPageProps,
): Promise<Metadata> {
  return listingMetadata(await propsOf(props));
}

/** Category listing: products in this category and all its subcategories. */
export default async function CategoryPage(props: CategoryPageProps) {
  // Called directly (it is an async server component), so the page resolves in one step.
  return ListingPage(await propsOf(props));
}
