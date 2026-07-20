import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, normalizeEmail } from "@/lib/api-utils";
import { getPortalRole, isPortalRole, portalRoute } from "@/lib/portal-auth";
import { insertRow, selectRows, updateRows } from "@/lib/supabase-data";

const schema = z.object({
  organisation: z.string().trim().min(2).max(160),
  requestedRole: z.enum(["client", "partner", "field"]),
  message: z.string().trim().max(1000).optional().default(""),
});

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ authenticated: false }, { status: 401 });
  const role = await getPortalRole(user.email);
  return Response.json({
    authenticated: true,
    user: { name: user.displayName, email: user.email },
    role,
    destination: role ? portalRoute(role) : null,
  });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const existingRole = await getPortalRole(user.email);
  if (existingRole) {
    return Response.json({ role: existingRole, destination: portalRoute(existingRole) });
  }
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success || !isPortalRole(parsed.data.requestedRole)) {
      return Response.json({ error: "Please complete the access request." }, { status: 400 });
    }
    const email = normalizeEmail(user.email);
    const now = new Date().toISOString();
    const [existing] = await selectRows<{ id: string }>("portal_access_requests", { filters: { email }, limit: 1, select: "id" });
    if (existing) {
      await updateRows("portal_access_requests", {
        organisation: parsed.data.organisation,
        requestedRole: parsed.data.requestedRole,
        message: parsed.data.message,
        status: "Pending",
        updatedAt: now,
      }, { id: existing.id });
    } else {
      await insertRow("portal_access_requests", {
        id: crypto.randomUUID(),
        email,
        name: user.displayName,
        ...parsed.data,
      });
    }
    return Response.json({ status: "Pending" }, { status: existing ? 200 : 201 });
  } catch (error) {
    return errorResponse(error, "The access request could not be saved.");
  }
}
