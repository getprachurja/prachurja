import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1200),
      }),
    )
    .min(1)
    .max(8),
});

const windows = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 12;
const WINDOW_MS = 10 * 60 * 1000;

const systemPrompt = `You are Prach, the concise and thoughtful website guide for Prachurja, an ecological restoration practice in India.

You may help with:
- Prachurja's assessment-led restoration process
- native species and local provenance
- invasive vegetation management
- living soil, water-sensitive restoration, erosion and fire resilience
- Miyawaki native forests, including suitability and limitations
- monitoring, maintenance and how to start a site assessment

Important boundaries:
- Do not provide prices, revenue projections, margins, capital expenditure, a ₹100 crore plan or investor claims. Those are not part of the public service.
- Never claim that Miyawaki is right for every site. Natural grasslands, wetlands and other non-forest ecosystems must not automatically be converted to dense forest.
- Do not prescribe a final species list or technical intervention without a site assessment and local ecological expertise.
- Do not invent Prachurja projects, credentials, addresses, phone numbers or performance figures.
- Do not provide emergency, medical or legal advice.
- Keep answers warm, practical and under 140 words. When useful, point to /approach, /solutions, /miyawaki or /assessment.`;

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "anonymous"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  windows.set(key, current);
  return current.count > RATE_LIMIT;
}

function localAnswer(question: string) {
  const text = question.toLowerCase();
  if (text.includes("miyawaki")) {
    return "Miyawaki can suit a compact urban, campus or buffer site when a local forest reference, suitable soil, water and establishment care are available. It is not a universal answer—and it should not replace grassland, wetland or other non-forest ecosystems. Start with the suitability guide at /miyawaki, then share your site at /assessment.";
  }
  if (text.includes("species") || text.includes("plant") || text.includes("tree")) {
    return "A responsible species list starts with the local reference ecosystem, natural range, seed provenance, soil, water and the role each plant will play. Prachurja does not use one generic list for every site. See /approach for the selection principle, or use /assessment to describe your land.";
  }
  if (text.includes("start") || text.includes("begin") || text.includes("information")) {
    return "Begin with the site: location, approximate area, existing vegetation, soil condition, seasonal water, disturbance history and your intended outcome. Prachurja uses that baseline to decide what to protect, what to repair and which method may fit. You can submit those details at /assessment.";
  }
  return "Prachurja begins with the land, then designs a site-specific sequence for native planting, soil and water care, establishment and monitoring. You can explore the process at /approach, review restoration work at /solutions, or describe your site at /assessment.";
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return Response.json(
      { error: "Please wait a little before asking Prach another question." },
      { status: 429 },
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please send a short restoration question." }, { status: 400 });
  }

  const latestQuestion = [...parsed.data.messages]
    .reverse()
    .find((message) => message.role === "user")?.content ?? "";
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ answer: localAnswer(latestQuestion), mode: "local" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...parsed.data.messages,
        ],
        temperature: 0.25,
        max_completion_tokens: 320,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return Response.json({ answer: localAnswer(latestQuestion), mode: "local" });
    }

    const result = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = result.choices?.[0]?.message?.content?.trim();
    return Response.json({
      answer: answer || localAnswer(latestQuestion),
      mode: answer ? "groq" : "local",
    });
  } catch {
    return Response.json({ answer: localAnswer(latestQuestion), mode: "local" });
  }
}
