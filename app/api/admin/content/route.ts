import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { deleteRows, insertRow, selectRows, updateRows } from "@/lib/supabase-data";

const resourceSchema = z.enum(["plants", "products", "blogs", "projects"]);
const slug = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug.");
const shortText = z.string().trim().min(1).max(240);
const longText = z.string().trim().max(12000);
const url = z.union([z.literal(""), z.string().url().max(1000), z.string().startsWith("/api/media/").max(200)]);

const schemas = {
  plants: z.object({ id: slug, commonName: shortText, botanicalName: shortText, region: shortText, ecologicalRole: shortText, waterRequirement: z.enum(["Low", "Moderate", "High"]), plantSize: shortText, price: z.number().min(0).max(10000000), stockStatus: z.enum(["Available", "Low stock", "Contract grow"]), imageUrl: url, description: longText, featured: z.boolean(), active: z.boolean(), sortOrder: z.number().int().min(0).max(10000) }),
  products: z.object({ id: slug, name: shortText, category: shortText, producer: shortText, location: shortText, price: z.number().min(0).max(10000000), badge: z.string().trim().max(120), imageUrl: url, description: longText, featured: z.boolean(), active: z.boolean(), sortOrder: z.number().int().min(0).max(10000) }),
  blogs: z.object({ id: slug, title: shortText, excerpt: z.string().trim().min(10).max(600), body: z.string().trim().min(20).max(40000), category: shortText, readTime: shortText, coverImageUrl: url, status: z.enum(["Draft", "Published"]), featured: z.boolean() }),
  projects: z.object({ id: slug, title: shortText, location: shortText, area: shortText, projectType: shortText, status: shortText, speciesCount: z.number().int().min(0).max(100000), period: shortText, progress: z.number().int().min(0).max(100), summary: z.string().trim().min(10).max(4000), imageUrl: url, featured: z.boolean(), published: z.boolean(), sortOrder: z.number().int().min(0).max(10000) }),
} as const;

const tables = { plants: "catalog_plants", products: "marketplace_products", blogs: "blog_posts", projects: "restoration_projects" } as const;

async function administrator() {
  const user = await getChatGPTUser();
  return user && await getPortalRole(user.email) === "admin" ? user : null;
}

function resourceFrom(request: Request) {
  return resourceSchema.safeParse(new URL(request.url).searchParams.get("resource"));
}

export async function GET(request: Request) {
  if (!await administrator()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  const resource = resourceFrom(request);
  if (!resource.success) return Response.json({ error: "Unknown content type" }, { status: 400 });
  try {
    const orderColumn = resource.data === "blogs" ? "updated_at" : "sort_order";
    return Response.json({ items: await selectRows(tables[resource.data], { order: { column: orderColumn, ascending: resource.data !== "blogs" } }) });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  const user = await administrator();
  if (!user) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const payload = await request.json() as { resource?: unknown; item?: unknown };
    const resource = resourceSchema.safeParse(payload.resource);
    if (!resource.success) return Response.json({ error: "Unknown content type" }, { status: 400 });
    const item = schemas[resource.data].safeParse(payload.item);
    if (!item.success) return Response.json({ error: item.error.issues[0]?.message ?? "Invalid content" }, { status: 400 });
    const now = new Date().toISOString();
    const row: Record<string, unknown> = { ...item.data, createdAt: now, updatedAt: now };
    if (resource.data === "blogs") Object.assign(row, { authorEmail: user.email, publishedAt: (item.data as { status: string }).status === "Published" ? now : null });
    return Response.json({ item: await insertRow(tables[resource.data], row) }, { status: 201 });
  } catch (error) { return errorResponse(error, "Content could not be created."); }
}

export async function PATCH(request: Request) {
  const user = await administrator();
  if (!user) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const payload = await request.json() as { resource?: unknown; id?: unknown; item?: unknown };
    const resource = resourceSchema.safeParse(payload.resource);
    const id = slug.safeParse(payload.id);
    if (!resource.success || !id.success) return Response.json({ error: "Invalid content reference" }, { status: 400 });
    const item = schemas[resource.data].safeParse(payload.item);
    if (!item.success || item.data.id !== id.data) return Response.json({ error: item.success ? "The URL slug cannot be changed." : item.error.issues[0]?.message ?? "Invalid content" }, { status: 400 });
    const row: Record<string, unknown> = { ...item.data, updatedAt: new Date().toISOString() };
    delete row.id;
    if (resource.data === "blogs") Object.assign(row, { authorEmail: user.email, publishedAt: (item.data as { status: string }).status === "Published" ? new Date().toISOString() : null });
    const [updated] = await updateRows<Record<string, unknown>>(tables[resource.data], row, { id: id.data });
    return Response.json({ item: updated });
  } catch (error) { return errorResponse(error, "Content could not be updated."); }
}

export async function DELETE(request: Request) {
  if (!await administrator()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  const resource = resourceFrom(request);
  const id = slug.safeParse(new URL(request.url).searchParams.get("id"));
  if (!resource.success || !id.success) return Response.json({ error: "Invalid content reference" }, { status: 400 });
  try {
    await deleteRows(tables[resource.data], { id: id.data });
    return Response.json({ ok: true });
  } catch (error) { return errorResponse(error, "Content could not be removed."); }
}
