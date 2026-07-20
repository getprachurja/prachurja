import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, normalizeEmail } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows, updateRows } from "@/lib/supabase-data";

async function admin() {
  const user = await getChatGPTUser();
  return user && await getPortalRole(user.email) === "admin" ? user : null;
}

const createSchema = z.object({
  email: z.string().email().max(180),
  name: z.string().trim().min(2).max(120),
  organisation: z.string().trim().min(2).max(160),
  role: z.enum(["admin", "client", "partner", "field"]),
});
const updateSchema = z.object({ id: z.string().uuid(), role: z.enum(["admin", "client", "partner", "field"]), status: z.enum(["Active", "Inactive"]) });

export async function GET() {
  if (!await admin()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    return Response.json({ members: await selectRows("portal_members", { order: { column: "email", ascending: true } }) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  if (!await admin()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Enter a valid user and role." }, { status: 400 });
    const email = normalizeEmail(parsed.data.email);
    const [existing] = await selectRows<{ id: string }>("portal_members", { filters: { email }, limit: 1, select: "id" });
    if (existing) {
      await updateRows("portal_members", { ...parsed.data, email, status: "Active", updatedAt: new Date().toISOString() }, { id: existing.id });
    } else {
      await insertRow("portal_members", { id: crypto.randomUUID(), ...parsed.data, email, status: "Active" });
    }
    return Response.json({ ok: true }, { status: existing ? 200 : 201 });
  } catch (error) {
    return errorResponse(error, "The portal user could not be saved.");
  }
}

export async function PATCH(request: Request) {
  if (!await admin()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid role update" }, { status: 400 });
    await updateRows("portal_members", { role: parsed.data.role, status: parsed.data.status, updatedAt: new Date().toISOString() }, { id: parsed.data.id });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "The portal user could not be updated.");
  }
}
