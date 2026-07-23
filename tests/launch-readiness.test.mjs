import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("public website is focused on ecological restoration", async () => {
  const [route, shell, home, content, metadata] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("components/raas/site-shell.tsx"),
    read("components/raas/home-page.tsx"),
    read("lib/raas-content.ts"),
    read("app/layout.tsx"),
  ]);

  for (const pathname of ["/approach", "/solutions", "/miyawaki", "/assessment"]) {
    assert.match(route, new RegExp(pathname.replace("/", "\\/")));
    assert.match(shell, new RegExp(`href="${pathname.replace("/", "\\/")}`));
  }

  for (const removed of ["/cart", "/nursery", "/marketplace", "/blog", "/economics", "/infrastructure"]) {
    assert.doesNotMatch(shell, new RegExp(`href="${removed.replace("/", "\\/")}`));
  }

  assert.match(home, /Native forests/);
  assert.match(home, /Restoration begins by listening to the land/);
  assert.match(content, /Miyawaki native forests/);
  assert.match(metadata, /Ecological Restoration/);
});

test("commercial plan figures are not exposed by the public experience", async () => {
  const publicSources = (
    await Promise.all([
      read("components/raas/home-page.tsx"),
      read("components/raas/solutions-page.tsx"),
      read("components/raas/method-page.tsx"),
      read("components/raas/miyawaki-page.tsx"),
      read("components/raas/assessment-page.tsx"),
      read("components/raas/site-shell.tsx"),
      read("lib/raas-content.ts"),
      read("app/layout.tsx"),
    ])
  ).join("\n");

  for (const internalOnly of [
    "100 Crore",
    "₹100",
    "per-hectare economics",
    "High-Margin Scale",
    "Capital expenditure",
    "Target gross yield",
  ]) {
    assert.doesNotMatch(publicSources, new RegExp(internalOnly, "i"));
  }
});

test("Miyawaki content includes suitability, limits and establishment", async () => {
  const [page, content] = await Promise.all([
    read("components/raas/miyawaki-page.tsx"),
    read("lib/raas-content.ts"),
  ]);
  for (const topic of [
    "local forest reference",
    "Natural grasslands",
    "wetlands",
    "Canopy",
    "Tree layer",
    "Sub-tree layer",
    "Shrub layer",
    "Establishment care",
  ]) {
    assert.match(`${page}\n${content}`, new RegExp(topic, "i"));
  }
});

test("Prach uses a server-only Groq route and excludes internal financial guidance", async () => {
  const [shell, companion, endpoint, env] = await Promise.all([
    read("components/raas/site-shell.tsx"),
    read("components/raas/prach-companion.tsx"),
    read("app/api/ai/route.ts"),
    read(".env.example"),
  ]);
  assert.match(shell, /PrachCompanion/);
  assert.match(companion, /fetch\("\/api\/ai"/);
  assert.match(companion, /Is Miyawaki right for my site/);
  assert.match(endpoint, /process\.env\.GROQ_API_KEY/);
  assert.match(endpoint, /https:\/\/api\.groq\.com/);
  assert.match(endpoint, /Do not provide prices/);
  assert.match(endpoint, /localAnswer/);
  assert.doesNotMatch(companion, /gsk_/);
  assert.doesNotMatch(endpoint, /gsk_/);
  assert.match(env, /GROQ_API_KEY=/);
});

test("site assessment writes to the secured backend without public price bands", async () => {
  const [form, endpoint, backend, migration] = await Promise.all([
    read("components/raas/assessment-page.tsx"),
    read("app/api/assessments/route.ts"),
    read("lib/supabase-data.ts"),
    read("supabase/migrations/20260720000100_launch_backend.sql"),
  ]);
  assert.match(form, /fetch\("\/api\/assessments"/);
  assert.match(form, /Miyawaki native forest/);
  assert.match(form, /Discuss after assessment/);
  assert.doesNotMatch(form, /Below ₹/);
  assert.match(endpoint, /assessment_requests/);
  assert.match(endpoint, /status: "New"/);
  assert.match(backend, /SUPABASE_APP_SECRET/);
  assert.match(migration, /enable row level security/);
});

test("operational portals remain separate and role protected", async () => {
  const [route, auth, roles, admin, portals] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("app/chatgpt-auth.ts"),
    read("lib/portal-auth.ts"),
    read("components/admin-control-centre.tsx"),
    read("components/launch-portals.tsx"),
  ]);
  for (const pathname of ["/client", "/partner-portal", "/field", "/admin"]) {
    assert.match(route, new RegExp(pathname.replace("/", "\\/")));
  }
  assert.match(route, /requireChatGPTUser/);
  assert.match(route, /canAccessPortal/);
  assert.match(auth, /supabase\.auth\.getUser/);
  assert.match(roles, /PRACHURJA_ADMIN_EMAILS/);
  assert.match(admin, /Evidence media/);
  assert.match(admin, /Users & roles/);
  for (const pathname of ["/client", "/partner-portal", "/field"]) {
    assert.match(portals, new RegExp(pathname.replace("/", "\\/")));
  }
});

test("Sites project remains connected", async () => {
  const hosting = await read(".openai/hosting.json");
  assert.match(hosting, /"project_id":\s*"appgprj_6a5b17149a388191b14aa910acb88bf2"/);
  assert.match(hosting, /"d1":\s*"DB"/);
  assert.match(hosting, /"r2":\s*"MEDIA"/);
});
