import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, normalizeEmail, reference } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows } from "@/lib/supabase-data";

const schema = z.object({
  taskCode: z.string().trim().min(2).max(60),
  projectName: z.string().trim().min(2).max(160),
  zone: z.string().trim().min(1).max(80),
  species: z.string().trim().min(2).max(160),
  quantity: z.number().int().positive().max(1_000_000),
  maintenanceNote: z.string().trim().max(2000).optional().default(""),
  issue: z.string().trim().max(1000).optional().default(""),
});

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const role = await getPortalRole(user.email);
  if (role !== "field" && role !== "admin") return Response.json({ error: "Field access required" }, { status: 403 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Complete the field report before submitting." }, { status: 400 });
    const reportReference = reference("PRC-FR");
    await insertRow("field_reports", { id: crypto.randomUUID(), reference: reportReference, reporterEmail: normalizeEmail(user.email), ...parsed.data });
    return Response.json({ reference: reportReference, status: "Submitted" }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "The field report could not be saved.");
  }
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const role = await getPortalRole(user.email);
  if (role !== "field" && role !== "admin") return Response.json({ error: "Field access required" }, { status: 403 });
  try {
    const rows = role === "admin"
      ? await selectRows("field_reports", { order: { column: "created_at" }, limit: 200 })
      : await selectRows("field_reports", { filters: { reporter_email: normalizeEmail(user.email) }, order: { column: "created_at" }, limit: 100 });
    return Response.json({ reports: rows });
  } catch (error) {
    return errorResponse(error);
  }
}
