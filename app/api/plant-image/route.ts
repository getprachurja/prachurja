import { NextRequest } from "next/server";

export const runtime = "nodejs";

const fallbackByLayer: Record<string, string> = {
  "Shrub Layer": "/hero-restoration.png",
  "Sub-Tree Layer": "/hero-restoration.png",
  "Tree Layer": "/hero-restoration.png",
  "Canopy Tree Layer": "/hero-restoration.png",
};

function safeName(value: string | null) {
  const name = value?.trim() ?? "";
  return /^[A-Za-z][A-Za-z .-]{2,100}$/.test(name) ? name : "";
}

export async function GET(request: NextRequest) {
  const name = safeName(request.nextUrl.searchParams.get("name"));
  const layer = request.nextUrl.searchParams.get("layer") ?? "Tree Layer";
  const fallback = new URL(fallbackByLayer[layer] ?? "/hero-restoration.png", request.url);

  if (!name) return Response.redirect(fallback, 307);

  try {
    const summary = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`, {
      headers: { "User-Agent": "PrachurjaBotanicalCatalogue/1.0 (https://prachurja-six.vercel.app)" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 604800 },
    });
    if (summary.ok) {
      const data = await summary.json() as { originalimage?: { source?: string }; thumbnail?: { source?: string } };
      const source = data.originalimage?.source ?? data.thumbnail?.source;
      if (source?.startsWith("https://upload.wikimedia.org/")) {
        return Response.redirect(source, 307);
      }
    }

    const search = new URL("https://commons.wikimedia.org/w/api.php");
    search.searchParams.set("action", "query");
    search.searchParams.set("generator", "search");
    search.searchParams.set("gsrsearch", `\"${name}\"`);
    search.searchParams.set("gsrnamespace", "6");
    search.searchParams.set("gsrlimit", "5");
    search.searchParams.set("prop", "imageinfo");
    search.searchParams.set("iiprop", "url");
    search.searchParams.set("iiurlwidth", "1000");
    search.searchParams.set("format", "json");
    search.searchParams.set("origin", "*");
    const response = await fetch(search, {
      headers: { "User-Agent": "PrachurjaBotanicalCatalogue/1.0 (https://prachurja-six.vercel.app)" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 604800 },
    });
    if (response.ok) {
      const data = await response.json() as { query?: { pages?: Record<string, { imageinfo?: Array<{ thumburl?: string; url?: string }> }> } };
      const source = Object.values(data.query?.pages ?? {}).flatMap((page) => page.imageinfo ?? [])[0]?.thumburl;
      if (source?.startsWith("https://upload.wikimedia.org/")) return Response.redirect(source, 307);
    }
  } catch {
    // The local ecological image keeps every card usable if Wikimedia is unavailable.
  }

  return Response.redirect(fallback, 307);
}
