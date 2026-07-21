import { errorResponse } from "@/lib/api-utils";
import { selectRows } from "@/lib/supabase-data";

export async function GET() {
  try {
    const [plantRows, productRows, projectRows, blogRows] = await Promise.all([
      selectRows<Record<string, unknown>>("catalog_plants", { filters: { active: true }, order: { column: "sort_order", ascending: true } }),
      selectRows<Record<string, unknown>>("marketplace_products", { filters: { active: true }, order: { column: "sort_order", ascending: true } }),
      selectRows<Record<string, unknown>>("restoration_projects", { filters: { published: true }, order: { column: "sort_order", ascending: true } }),
      selectRows<Record<string, unknown>>("blog_posts", { filters: { status: "Published" }, order: { column: "published_at", ascending: false } }),
    ]);

    return Response.json({
      plants: plantRows.map((row) => ({ id: row.id, common: row.commonName, botanical: row.botanicalName, region: row.region, role: row.ecologicalRole, water: row.waterRequirement, size: row.plantSize, price: Number(row.price), stock: row.stockStatus, image: row.imageUrl, description: row.description })),
      products: productRows.map((row) => [row.id, row.name, row.category, row.producer, row.location, Number(row.price), row.badge]),
      projects: projectRows.map((row) => ({ id: row.id, title: row.title, location: row.location, area: row.area, type: row.projectType, status: row.status, species: Number(row.speciesCount), period: row.period, progress: Number(row.progress), summary: row.summary, image: row.imageUrl })),
      articles: blogRows.map((row) => [row.category, row.title, row.readTime, row.category, row.id, row.excerpt, row.body, row.coverImageUrl]),
    }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    return errorResponse(error, "Catalogue content could not be loaded.");
  }
}
