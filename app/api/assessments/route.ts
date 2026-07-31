import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { errorResponse, normalizeEmail, reference } from "@/lib/api-utils";
import { getPortalRole } from "@/lib/portal-auth";
import { insertRow, selectRows } from "@/lib/supabase-data";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  organisation: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(8).max(30),
  clientType: z.string().trim().min(1).max(80),
  state: z.string().trim().min(2).max(100),
  district: z.string().trim().min(2).max(100),
  address: z.string().trim().min(4).max(300),
  area: z.string().trim().min(1).max(40),
  unit: z.string().trim().min(1).max(40),
  ownership: z.string().trim().min(1).max(80),
  condition: z.string().trim().min(1).max(100),
  water: z.string().trim().min(1).max(80),
  vegetation: z.string().trim().min(1).max(1000),
  objective: z.string().trim().min(1).max(120),
  timeline: z.string().trim().min(1).max(80),
  budget: z.string().trim().min(1).max(80),
  maintenance: z.string().trim().min(1).max(80),
  reporting: z.string().trim().min(1).max(80),
  message: z.string().trim().max(3000).optional().default(""),
  cartItems: z.array(z.object({
    id: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    quantity: z.number().int().min(1).max(999),
  })).max(100).optional().default([]),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Please review the highlighted information." }, { status: 400 });
    }
    const { cartItems, ...data } = parsed.data;
    const plantRows = cartItems.length
      ? await selectRows<{ id: string; commonName: string; botanicalName: string; price: number | string }>("catalog_plants", {
          filters: { active: true },
          limit: 100,
        })
      : [];
    const plantsById = new Map(plantRows.map((plant) => [plant.id, plant]));
    if (cartItems.some((item) => !plantsById.has(item.id))) {
      return Response.json({ error: "One or more nursery plants are no longer available. Please review your cart." }, { status: 400 });
    }
    const nurseryItems = cartItems.map((item) => {
      const plant = plantsById.get(item.id)!;
      return {
        id: item.id,
        commonName: plant.commonName,
        botanicalName: plant.botanicalName,
        unitPrice: Number(plant.price),
        quantity: item.quantity,
        indicativeTotal: Number(plant.price) * item.quantity,
      };
    });
    const id = crypto.randomUUID();
    const requestReference = reference("PRC-SA");
    await insertRow("assessment_requests", {
      id,
      reference: requestReference,
      submitterEmail: normalizeEmail(data.email),
      ...data,
      website: undefined,
      nurseryItems,
    });
    return Response.json({ id, reference: requestReference, status: "New" }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "The assessment request could not be saved.");
  }
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const role = await getPortalRole(user.email);
  if (!role) return Response.json({ error: "Portal access required" }, { status: 403 });

  try {
    const rows = role === "admin"
      ? await selectRows("assessment_requests", { order: { column: "created_at" }, limit: 100 })
      : await selectRows("assessment_requests", { filters: { submitter_email: normalizeEmail(user.email) }, order: { column: "created_at" }, limit: 30 });
    return Response.json({ assessments: rows });
  } catch (error) {
    return errorResponse(error);
  }
}
