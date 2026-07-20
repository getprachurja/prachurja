import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, reference } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows } from "@/lib/supabase-data";

const schema = z.object({
  name: z.string().trim().min(2).max(100), organisation: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180), phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(2).max(120), message: z.string().trim().min(10).max(2500),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Please complete the required contact fields." }, { status: 400 });
    const { website, ...data } = parsed.data; void website;
    const messageReference = reference("PRC-CM");
    await insertRow("contact_messages", { id: crypto.randomUUID(), reference: messageReference, ...data });
    return Response.json({ reference: messageReference, status: "New" }, { status: 201 });
  } catch (error) { return errorResponse(error, "Your message could not be saved."); }
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user || await getPortalRole(user.email) !== "admin") return Response.json({ error: "Administrator access required" }, { status: 403 });
  try { return Response.json({ messages: await selectRows("contact_messages", { order: { column: "created_at" }, limit: 100 }) }); }
  catch (error) { return errorResponse(error); }
}
