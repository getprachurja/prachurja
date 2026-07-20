import { z } from "zod";

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(800),
  })).min(1).max(10),
});

const instructions = `You are Prach, Prachurja's concise and warm ecological-restoration website companion for India.
Help visitors understand native plants, restoration assessments, project services, partner registration, and how to navigate Prachurja.
Never claim that a plant is suitable for a site without an assessment. Distinguish restoration from simple tree planting.
Do not diagnose medical, legal, financial, or emergency situations. If someone is in immediate danger, direct them to local emergency services.
Do not invent project outcomes, availability, prices, certifications, or timelines. Invite visitors to submit the assessment form when site-specific guidance is needed.
Use plain language, short paragraphs, and no more than 140 words unless the user explicitly asks for detail.`;

function fallbackAnswer(question: string): string {
  const text = question.toLowerCase();
  if (/assessment|site visit|quote|cost|price|budget|start.*restoration|restore.*land|restoration project/.test(text)) return "The best starting point is the site-assessment form. It captures your location, land condition, area, objective, timeline and budget so the team can propose an appropriate next step. I can take you there: /assessment";
  if (/partner|supplier|contractor|ecologist|worker|become.*nursery|register.*nursery/.test(text)) return "Prachurja has pathways for nurseries, product sellers, seed suppliers, contractors, ecologists, field workers, CSR teams and NGOs. Choose the closest pathway here: /partner";
  if (/plant|species|native|nursery/.test(text)) return "Native species should be matched to local ecology, soil, water, provenance and the restoration objective. You can browse the nursery catalogue, but a large or sensitive site should begin with an assessment: /nursery";
  if (/project|impact|monitor/.test(text)) return "The Projects & Impact area explains the full recovery journey—baseline, intervention, maintenance and monitoring—not only planting totals. Explore it here: /projects";
  if (/login|portal|dashboard|admin|client/.test(text)) return "For client or project support, contact the Prachurja team through the support page: /contact";
  return "I can help with native plants, restoration services, assessments, partner pathways, projects and portal navigation. Tell me what kind of land, project or support you are looking for, and I’ll point you to the right next step.";
}

export async function POST(request: Request) {
  let parsed: z.infer<typeof schema>;
  try {
    const result = schema.safeParse(await request.json());
    if (!result.success) return Response.json({ error: "Please send a shorter message." }, { status: 400 });
    parsed = result.data;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const runtime = process.env as Record<string, string | undefined>;
  const apiKey = runtime.GROQ_API_KEY;
  const latestQuestion = [...parsed.messages].reverse().find((message) => message.role === "user")?.content ?? "";
  if (!apiKey) return Response.json({ answer: fallbackAnswer(latestQuestion), mode: "guided" });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: runtime.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: instructions }, ...parsed.messages],
        max_completion_tokens: 450,
        temperature: 0.35,
      }),
    });
    if (!response.ok) throw new Error(`Groq request failed with ${response.status}`);
    const result = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
    const answer = result.choices?.[0]?.message?.content?.trim();
    return Response.json({ answer: answer || fallbackAnswer(latestQuestion), mode: answer ? "ai" : "guided" });
  } catch (error) {
    console.error(error);
    return Response.json({ answer: fallbackAnswer(latestQuestion), mode: "guided" });
  }
}
