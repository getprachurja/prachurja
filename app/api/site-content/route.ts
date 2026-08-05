import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { defaultSiteContent, editableSiteContentKeys, type SiteContentKey } from "@/lib/site-content";
import { selectRows, upsertRows } from "@/lib/supabase-data";

export async function GET() {
  try {
    const rows = await selectRows<{ key: string; value: string }>("site_content");
    const content = { ...defaultSiteContent };
    for (const row of rows) if (editableSiteContentKeys.includes(row.key as SiteContentKey)) content[row.key as SiteContentKey] = row.value;
    if (["/hero-restoration.png", "/hero-restoration-v2.png"].includes(content.heroImageUrl)) content.heroImageUrl = defaultSiteContent.heroImageUrl;
    return Response.json({ content });
  } catch (error) { return errorResponse(error, "Website content could not be loaded."); }
}

const schema = z.object({ content: z.record(z.string(), z.string().trim().max(700)) });

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user || await getPortalRole(user.email) !== "admin") return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid website content" }, { status: 400 });
    const now = new Date().toISOString();
    const entries = Object.entries(parsed.data.content).filter(([key]) => editableSiteContentKeys.includes(key as SiteContentKey));
    await upsertRows("site_content", entries.map(([key, value]) => ({ key, value, updatedBy: user.email, updatedAt: now })), "key");
    return Response.json({ ok:true, updated:entries.length, content:{ ...defaultSiteContent, ...Object.fromEntries(entries) } });
  } catch (error) { return errorResponse(error, "Website content could not be saved."); }
}
