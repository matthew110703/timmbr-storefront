import { NextResponse, type NextRequest } from "next/server";
import { getSearchSuggestions } from "@/lib/api/listing";

/** Same cap as core's; longer input is cut rather than rejected (it's mid-typing). */
const MAX_QUERY_LENGTH = 100;

/**
 * Header search typeahead for every zone: the browser calls this same-origin route (under
 * /products, which the shell routes to this zone) and it forwards to core with the internal
 * key. Popular prefixes are cached at the edge for a minute; core caches each query in Redis.
 * A query shorter than 2 characters gets an empty list without calling core.
 */
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_QUERY_LENGTH);
  if (q.length < 2) {
    return NextResponse.json(
      { products: [] },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" } },
    );
  }

  try {
    const suggestions = await getSearchSuggestions(q);
    return NextResponse.json(suggestions, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Suggestions unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
