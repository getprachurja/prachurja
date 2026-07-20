import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { countRows, selectRows } from "@/lib/supabase-data";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user || await getPortalRole(user.email) !== "admin") {
    return Response.json({ error: "Administrator access required" }, { status: 403 });
  }
  try {
    const [assessmentCount, partnerCount, accessCount, contactCount, assessments, applications, accessRequests, messages] = await Promise.all([
      countRows("assessment_requests"),
      countRows("partner_applications"),
      countRows("portal_access_requests"),
      countRows("contact_messages"),
      selectRows("assessment_requests", { order: { column: "created_at" }, limit: 20 }),
      selectRows("partner_applications", { order: { column: "created_at" }, limit: 10 }),
      selectRows("portal_access_requests", { order: { column: "created_at" }, limit: 10 }),
      selectRows("contact_messages", { order: { column: "created_at" }, limit: 20 }),
    ]);
    return Response.json({
      counts: {
        assessments: assessmentCount,
        partners: partnerCount,
        accessRequests: accessCount,
        contacts: contactCount,
      },
      assessments,
      applications,
      accessRequests,
      messages,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
