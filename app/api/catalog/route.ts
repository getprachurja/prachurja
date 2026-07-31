import { getCatalogPlants } from "@/lib/nursery-data";

export async function GET() {
  const plants = await getCatalogPlants();
  return Response.json(
    { plants },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
