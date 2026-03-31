import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getOriginalUrlBySlugAndIncrementClicks } from "@/data/links";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/[slug]">,
) {
  const { slug } = await context.params;
  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const originalUrl =
    await getOriginalUrlBySlugAndIncrementClicks(normalizedSlug);

  if (!originalUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(originalUrl, 307);
}
