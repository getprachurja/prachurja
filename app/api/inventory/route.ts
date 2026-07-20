import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, normalizeEmail } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows, updateRows } from "@/lib/supabase-data";

const schema = z.object({
  id: z.string().uuid().optional(),
  batchCode: z.string().trim().min(3).max(60),
  species: z.string().trim().min(2).max(160),
  size: z.string().trim().min(1).max(80),
  available: z.number().int().min(0).max(10_000_000),
});

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const role = await getPortalRole(user.email);
  if (role !== "partner" && role !== "admin") return Response.json({ error: "Partner access required" }, { status: 403 });
  try {
    const rows = role === "admin"
      ? await selectRows("nursery_inventory", { order: { column: "updated_at" }, limit: 200 })
      : await selectRows("nursery_inventory", { filters: { owner_email: normalizeEmail(user.email) }, order: { column: "updated_at" }, limit: 100 });
    return Response.json({ inventory: rows });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const role = await getPortalRole(user.email);
  if (role !== "partner" && role !== "admin") return Response.json({ error: "Partner access required" }, { status: 403 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Check the batch information." }, { status: 400 });
    const now = new Date().toISOString();
    const ownerEmail = normalizeEmail(user.email);
    const [existing] = await selectRows<{ id: string; ownerEmail: string }>("nursery_inventory", { filters: { batch_code: parsed.data.batchCode }, limit: 1, select: "id,owner_email" });
    if (existing && role !== "admin" && existing.ownerEmail !== ownerEmail) return Response.json({ error: "This batch belongs to another partner." }, { status: 403 });
    if (existing) {
      await updateRows("nursery_inventory", { species: parsed.data.species, size: parsed.data.size, available: parsed.data.available, updatedAt: now }, { id: existing.id });
    } else {
      await insertRow("nursery_inventory", { id: crypto.randomUUID(), ownerEmail, batchCode: parsed.data.batchCode, species: parsed.data.species, size: parsed.data.size, available: parsed.data.available });
    }
    return Response.json({ ok: true, id: existing?.id ?? null });
  } catch (error) {
    return errorResponse(error, "Inventory could not be saved.");
  }
}
