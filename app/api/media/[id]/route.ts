import { supabaseFunctionUrl, supabaseServerHeaders } from "@/lib/supabase-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetch(`${supabaseFunctionUrl("prachurja-media")}?id=${encodeURIComponent(id)}`, { headers: supabaseServerHeaders() });
  if (!response.ok || !response.body) return new Response("Not found", { status: response.status === 404 ? 404 : 503 });
  const headers = new Headers();
  for (const key of ["content-type", "content-length", "cache-control", "x-content-type-options"]) {
    const value = response.headers.get(key);
    if (value) headers.set(key, value);
  }
  return new Response(response.body, { headers });
}
