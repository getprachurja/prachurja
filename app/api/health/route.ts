import { selectRows } from "@/lib/supabase-data";

export async function GET() {
  try {
    const [health] = await selectRows<{ id: string }>("backend_health", { filters: { id: "ready" }, limit: 1, select: "id" });
    if (!health) throw new Error("Backend health record is unavailable");
    return Response.json({ status: "ok", database: "supabase", storage: "supabase", service: "prachurja" });
  } catch {
    return Response.json({ status: "degraded", database: "unavailable", service: "prachurja" }, { status: 503 });
  }
}
