import { NextResponse, type NextRequest } from "next/server";
import { getListingFacets } from "@/lib/api/listing";
import { parseListingUrl, toListingQuery } from "@/lib/listing";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Facet counts for the mobile filter drawer's staged selection: the same query string as the
 * page, plus `category`. Lives under /products, which the shell already routes to this zone.
 * (Not under /catalog-static: a route folder named like the assetPrefix breaks next/font in
 * Turbopack.) Responses are public and cached at the edge for 30s.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category") ?? undefined;
  if (category !== undefined && !SLUG.test(category)) {
    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  }

  const state = parseListingUrl(params);
  try {
    const facets = await getListingFacets(
      toListingQuery({ ...state, page: 1 }, category),
    );
    return NextResponse.json(facets, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Counts unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
