import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.57.4";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 8 * 1024 * 1024;

function clients(secret = "") {
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) throw new Error("Supabase function environment is unavailable");
  return {
    anon: createClient(url, anonKey, { auth: { persistSession: false }, global: { headers: { "x-prachurja-app-key": secret } } }),
    admin: createClient(url, serviceKey, { auth: { persistSession: false } }),
  };
}

async function authorised(request: Request) {
  const secret = request.headers.get("x-prachurja-app-key") ?? "";
  if (!secret) return false;
  const { anon } = clients(secret);
  const { data, error } = await anon
    .from("backend_health")
    .select("id")
    .eq("id", "ready")
    .limit(1);
  return !error && data?.[0]?.id === "ready";
}

Deno.serve(async (request) => {
  if (!await authorised(request)) return Response.json({ error: "Forbidden" }, { status: 403 });
  const { admin } = clients();
  const url = new URL(request.url);

  if (request.method === "POST") {
    const data = await request.formData();
    const file = data.get("file");
    const altText = String(data.get("altText") ?? "").trim().slice(0, 240);
    const uploadedBy = String(data.get("uploadedBy") ?? "").trim().toLowerCase();
    if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size < 1 || file.size > maxBytes || !uploadedBy) {
      return Response.json({ error: "Invalid upload" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120) || "image";
    const objectKey = `media/${id}-${safeName}`;
    const { error: uploadError } = await admin.storage.from("prachurja-media").upload(objectKey, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (uploadError) return Response.json({ error: "Upload failed" }, { status: 500 });
    const { error: metadataError } = await admin.from("media_assets").insert({
      id,
      object_key: objectKey,
      filename: file.name,
      content_type: file.type,
      size: file.size,
      alt_text: altText,
      uploaded_by: uploadedBy,
    });
    if (metadataError) {
      await admin.storage.from("prachurja-media").remove([objectKey]);
      return Response.json({ error: "Upload metadata failed" }, { status: 500 });
    }
    return Response.json({ id, filename: file.name }, { status: 201 });
  }

  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Media ID required" }, { status: 400 });
  const { data: asset } = await admin.from("media_assets").select("*").eq("id", id).maybeSingle();
  if (!asset) return Response.json({ error: "Not found" }, { status: 404 });

  if (request.method === "GET") {
    const { data, error } = await admin.storage.from("prachurja-media").download(asset.object_key);
    if (error || !data) return Response.json({ error: "Not found" }, { status: 404 });
    return new Response(data.stream(), {
      headers: {
        "Content-Type": asset.content_type,
        "Content-Length": String(asset.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  if (request.method === "DELETE") {
    const { error: storageError } = await admin.storage.from("prachurja-media").remove([asset.object_key]);
    if (storageError) return Response.json({ error: "Delete failed" }, { status: 500 });
    await admin.from("media_assets").delete().eq("id", id);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, POST, DELETE" } });
});
