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

  for (const pathname of ["/approach", "/nursery", "/solutions", "/miyawaki", "/assessment", "/cart", "/blog"]) {
    assert.match(route, new RegExp(pathname.replace("/", "\\/")));
    assert.match(shell, new RegExp(`href="${pathname.replace("/", "\\/")}`));
  }

  for (const removed of ["/marketplace", "/economics", "/infrastructure"]) {
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
  assert.match(endpoint, /Do not invent nursery prices/);
  assert.match(endpoint, /Do not provide revenue projections/);
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
  assert.match(form, /cartItems/);
  assert.match(form, /raas-cart-attached/);
  assert.doesNotMatch(form, /Below ₹/);
  assert.match(endpoint, /assessment_requests/);
  assert.match(endpoint, /catalog_plants/);
  assert.match(endpoint, /nurseryItems/);
  assert.match(endpoint, /status: "New"/);
  assert.match(backend, /SUPABASE_APP_SECRET/);
  assert.match(migration, /enable row level security/);
});

test("native nursery, plant details and quotation cart are complete", async () => {
  const [route, nursery, card, detail, profiles, cart, context, api, home] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("components/raas/nursery-page.tsx"),
    read("components/raas/nursery-plant-card.tsx"),
    read("components/raas/plant-detail-page.tsx"),
    read("lib/plant-profiles.ts"),
    read("components/raas/cart-page.tsx"),
    read("components/raas/cart-context.tsx"),
    read("app/api/catalog/route.ts"),
    read("components/raas/home-page.tsx"),
  ]);
  assert.match(route, /getCatalogPlants/);
  assert.match(route, /startsWith\("\/plants\/"\)/);
  assert.match(nursery, /Search native plants/);
  assert.match(nursery, /Water requirement/);
  assert.match(card, /Add to cart/);
  assert.match(detail, /Suitability check required/);
  assert.match(detail, /Species characteristics/);
  assert.match(detail, /Planting &amp; care/);
  assert.match(profiles, /Planting season/);
  assert.match(cart, /No payment is taken here/);
  assert.match(context, /prachurja_nursery_cart_v2/);
  assert.match(context, /version: 2/);
  assert.match(api, /getCatalogPlants/);
  assert.match(home, /Browse the nursery/);
});

test("field journal is public, database backed and discoverable", async () => {
  const [route, shell, page, article, data, home] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("components/raas/site-shell.tsx"),
    read("components/raas/blog-page.tsx"),
    read("components/raas/blog-article-page.tsx"),
    read("lib/blog-data.ts"),
    read("components/raas/home-page.tsx"),
  ]);
  assert.match(route, /getBlogPosts/);
  assert.match(route, /startsWith\("\/blog\/"\)/);
  assert.match(shell, /Field journal/);
  assert.match(page, /Notes for restoring living landscapes/);
  assert.match(article, /Use this note well/);
  assert.match(data, /blog_posts/);
  assert.match(home, /From the field journal/);
});

test("Prachurja trademark treatment appears across public and portal brands", async () => {
  const [shell, metadata, companion, login, portal] = await Promise.all([
    read("components/raas/site-shell.tsx"),
    read("app/layout.tsx"),
    read("components/raas/prach-companion.tsx"),
    read("app/login/login-form.tsx"),
    read("components/launch-portals.tsx"),
  ]);
  for (const source of [shell, metadata, companion, login, portal]) assert.match(source, /Prachurja™|PRACHURJA™/i);
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
  assert.match(admin, /Catalog & content/);
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
