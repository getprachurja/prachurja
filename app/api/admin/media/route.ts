import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { selectRows, supabaseFunctionUrl, supabaseServerHeaders } from "@/lib/supabase-data";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 8 * 1024 * 1024;

async function admin() {
  const user = await getChatGPTUser();
  return user && await getPortalRole(user.email) === "admin" ? user : null;
}

export async function GET() {
  if (!await admin()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const assets = await selectRows<Record<string, unknown>>("media_assets", { order: { column: "created_at" }, limit: 100 });
    return Response.json({ assets: assets.map((asset) => ({ ...asset, url: `/api/media/${asset.id}` })) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const user = await admin();
  if (!user) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size < 1 || file.size > maxBytes) {
      return Response.json({ error: "Upload a JPG, PNG or WebP image up to 8 MB." }, { status: 400 });
    }
    data.set("uploadedBy", user.email);
    const response = await fetch(supabaseFunctionUrl("prachurja-media"), { method: "POST", headers: supabaseServerHeaders(), body: data });
    const payload = await response.json();
    if (!response.ok) return Response.json({ error: "The image could not be uploaded." }, { status: response.status });
    return Response.json({ ...payload, url: `/api/media/${payload.id}` }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "The image could not be uploaded.");
  }
}

export async function DELETE(request: Request) {
  if (!await admin()) return Response.json({ error: "Administrator access required" }, { status: 403 });
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Media ID required" }, { status: 400 });
    const response = await fetch(`${supabaseFunctionUrl("prachurja-media")}?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: supabaseServerHeaders() });
    if (!response.ok) return Response.json({ error: response.status === 404 ? "Media not found" : "The image could not be removed." }, { status: response.status });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "The image could not be removed.");
  }
}
