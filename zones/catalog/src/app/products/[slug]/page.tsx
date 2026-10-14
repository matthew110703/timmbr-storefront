import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@timmbr/ui";
import { env } from "@/env";
import { getPdpTrust } from "@/lib/api/cms";
import { getProduct } from "@/lib/api/product";
import { productJsonLd, resolveVariant } from "@/lib/product";
import { ProductView } from "@/components/Product/ProductView";
import { RecentlyViewed } from "@/components/Product/RecentlyViewed";
import {
  SimilarProducts,
  SimilarProductsSkeleton,
} from "@/components/Product/SimilarProducts";
import { strings } from "./strings";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const origin = () =>
  `${env.NEXT_PUBLIC_DOMAIN.startsWith("localhost") ? "http" : "https"}://${env.NEXT_PUBLIC_DOMAIN}`;

/**
 * SEO: one canonical URL per product (variant params like `?finish=walnut` point to it), the
 * product's own title and summary, and the first image for link previews.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProduct(slug);
  if (result.status !== "ok") return {};
  const { product } = result;
  const image = product.images[0];
  return {
    title: strings.metadata.title(product.title),
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      ...(image && { images: [{ url: image.url, alt: image.alt }] }),
    },
  };
}

/**
 * Product detail page. The product (all variants, images, specs) comes in one cached core call
 * before the response starts, so an unknown product is a real 404. The URL's options pick the
 * first variant on the server; switching is client-side. Similar products stream in after.
 */
export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const [result, query, trustSection] = await Promise.all([
    getProduct(slug),
    searchParams,
    getPdpTrust(),
  ]);
  if (result.status !== "ok") notFound();
  const { product } = result;
  const variant = resolveVariant(product, query);

  const trust = {
    items: trustSection?.items?.length
      ? trustSection.items
      : [...strings.trust.items],
    note: trustSection ? trustSection.note : strings.trust.note,
  };
  const crumbs = [
    // Home is the shell (another zone): a full page load.
    { label: strings.home, href: "/", crossZone: true },
    ...product.breadcrumb.map((crumb) => ({
      label: crumb.name,
      href: `/category/${crumb.slug}`,
    })),
    { label: product.title },
  ];

  return (
    <div className="flex flex-col gap-12 pb-28 pt-4 lg:gap-20 lg:pb-20 lg:pt-6">
      <div className="flex flex-col gap-4 lg:gap-6">
        <Breadcrumb
          items={crumbs}
          linkComponent={Link}
          ariaLabel={strings.breadcrumb}
        />
        <ProductView
          product={product}
          initialVariantId={variant.id}
          trust={trust}
        />
      </div>
      <Suspense fallback={<SimilarProductsSkeleton />}>
        <SimilarProducts
          categorySlug={product.categorySlug}
          excludeId={product.id}
        />
      </Suspense>
      <RecentlyViewed
        currentSlug={product.slug}
        title={strings.recentlyViewed}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product, origin())).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
    </div>
  );
}
