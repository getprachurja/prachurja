import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, normalizeEmail, reference } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows } from "@/lib/supabase-data";

const schema = z.object({
  pathway: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(100),
  organisation: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(180),
  contact: z.string().trim().min(5).max(180),
  capacity: z.string().trim().min(10).max(2500),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Please complete every registration field." }, { status: 400 });
    }
    const { website, ...data } = parsed.data;
    void website;
    const id = crypto.randomUUID();
    const applicationReference = reference("PRC-PA");
    await insertRow("partner_applications", {
      id,
      reference: applicationReference,
      ...data,
    });
    return Response.json({ id, reference: applicationReference, status: "New" }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "The partner application could not be saved.");
  }
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const role = await getPortalRole(user.email);
  if (!role) return Response.json({ error: "Portal access required" }, { status: 403 });
  try {
    const rows = role === "admin"
      ? await selectRows("partner_applications", { order: { column: "created_at" }, limit: 100 })
      : await selectRows("partner_applications", { filters: { contact: normalizeEmail(user.email) }, order: { column: "created_at" }, limit: 30 });
    return Response.json({ applications: rows });
  } catch (error) {
    return errorResponse(error);
  }
}
