import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows, updateRows } from "@/lib/supabase-data";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("assessment-status"), id: z.string().uuid(), status: z.enum(["New", "Reviewing", "Assessment scheduled", "Closed"]), note: z.string().max(2000).optional() }),
  z.object({ action: z.literal("partner-status"), id: z.string().uuid(), status: z.enum(["New", "Reviewing", "Approved", "Declined"]) }),
  z.object({ action: z.literal("contact-status"), id: z.string().uuid(), status: z.enum(["New", "In progress", "Resolved"]) }),
  z.object({ action: z.literal("approve-access"), id: z.string().uuid(), role: z.enum(["client", "partner", "field"]) }),
]);

type AccessRequest = { id: string; email: string; name: string; organisation: string; status: string };

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user || await getPortalRole(user.email) !== "admin") {
    return Response.json({ error: "Administrator access required" }, { status: 403 });
  }
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid workflow update" }, { status: 400 });
    const now = new Date().toISOString();
    if (parsed.data.action === "assessment-status") {
      await updateRows("assessment_requests", { status: parsed.data.status, internalNote: parsed.data.note ?? "", updatedAt: now }, { id: parsed.data.id });
    } else if (parsed.data.action === "partner-status") {
      await updateRows("partner_applications", { status: parsed.data.status, updatedAt: now }, { id: parsed.data.id });
    } else if (parsed.data.action === "contact-status") {
      await updateRows("contact_messages", { status: parsed.data.status, updatedAt: now }, { id: parsed.data.id });
    } else {
      const [access] = await selectRows<AccessRequest>("portal_access_requests", { filters: { id: parsed.data.id, status: "Pending" }, limit: 1 });
      if (!access) return Response.json({ error: "Access request not found" }, { status: 404 });
      const [member] = await selectRows<{ id: string }>("portal_members", { filters: { email: access.email }, limit: 1, select: "id" });
      if (member) {
        await updateRows("portal_members", { role: parsed.data.role, status: "Active", organisation: access.organisation, name: access.name, updatedAt: now }, { id: member.id });
      } else {
        await insertRow("portal_members", { id: crypto.randomUUID(), email: access.email, name: access.name, organisation: access.organisation, role: parsed.data.role });
      }
      await updateRows("portal_access_requests", { status: "Approved", updatedAt: now }, { id: access.id });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
