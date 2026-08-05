import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the previous public experience is restored across the complete route inventory", async () => {
  const [entry, route, platform, content, metadata] = await Promise.all([
    read("app/page.tsx"),
    read("app/[...slug]/page.tsx"),
    read("components/platform-app.tsx"),
    read("lib/site-content.ts"),
    read("app/layout.tsx"),
  ]);

  assert.match(entry, /PlatformApp/);
  assert.match(route, /PlatformApp/);
  for (const pathname of [
    "/nursery",
    "/marketplace",
    "/services",
    "/miyawaki",
    "/projects",
    "/knowledge",
    "/blog",
    "/partner",
    "/contact",
    "/assessment",
    "/cart",
  ]) {
    assert.match(platform, new RegExp(pathname.replace("/", "\\/")));
  }

  assert.match(content, /Native Plants\./);
  assert.match(content, /Local Livelihoods\./);
  assert.match(content, /Living Forests\./);
  assert.match(platform, /One connected system/);
  assert.match(platform, /The restoration journey/);
  assert.match(metadata, /connected ecological restoration platform/);
});

test("Miyawaki is the retained current section and includes responsible suitability guidance", async () => {
  const [platform, page, content] = await Promise.all([
    read("components/platform-app.tsx"),
    read("components/raas/miyawaki-page.tsx"),
    read("lib/raas-content.ts"),
  ]);

  assert.match(platform, /MiyawakiPage/);
  assert.match(platform, /Miyawaki Forests/);
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

test("nursery shopping, detailed plant references and the quotation cart remain complete", async () => {
  const [platform, cart, cartStore, catalog] = await Promise.all([
    read("components/platform-app.tsx"),
    read("components/cart-page.tsx"),
    read("lib/cart.ts"),
    read("app/api/catalog/route.ts"),
  ]);

  assert.match(platform, /Search common name, botanical name or ecological role/);
  assert.match(platform, /Species characteristics/);
  assert.match(platform, /Planting & care/);
  assert.match(platform, /Add to cart/);
  assert.match(platform, /Request bulk quotation/);
  assert.match(cart, /No payment is taken here/);
  assert.match(cart, /Continue to assessment/);
  assert.match(cartStore, /prachurja_cart_v1/);
  assert.match(catalog, /catalog_plants/);
  assert.match(catalog, /marketplace_products/);
});

test("Prach uses the server-only Groq route and understands the restored site", async () => {
  const [platform, companion, endpoint, env] = await Promise.all([
    read("components/platform-app.tsx"),
    read("components/ai-companion.tsx"),
    read("app/api/ai/route.ts"),
    read(".env.example"),
  ]);

  assert.match(platform, /AiCompanion/);
  assert.match(companion, /fetch\("\/api\/ai"/);
  assert.match(companion, /Prach/);
  assert.match(endpoint, /process\.env\.GROQ_API_KEY/);
  assert.match(endpoint, /https:\/\/api\.groq\.com/);
  for (const pathname of ["/nursery", "/marketplace", "/services", "/projects", "/knowledge", "/blog", "/miyawaki", "/assessment"]) {
    assert.match(endpoint, new RegExp(pathname.replace("/", "\\/")));
  }
  assert.doesNotMatch(companion, /gsk_/);
  assert.doesNotMatch(endpoint, /gsk_/);
  assert.match(env, /GROQ_API_KEY=/);
});

test("the public site excludes internal financial-plan claims", async () => {
  const publicSources = (
    await Promise.all([
      read("components/platform-app.tsx"),
      read("components/information-pages.tsx"),
      read("components/knowledge-hub.tsx"),
      read("components/raas/miyawaki-page.tsx"),
      read("lib/site-content.ts"),
      read("app/layout.tsx"),
    ])
  ).join("\n");

  for (const internalOnly of [
    "100 Crore",
    "High-Margin Scale",
    "Target gross yield",
    "Capital expenditure",
  ]) {
    assert.doesNotMatch(publicSources, new RegExp(internalOnly, "i"));
  }
});

test("Prachurja trademark treatment appears in public branding", async () => {
  const [platform, metadata, miyawaki] = await Promise.all([
    read("components/platform-app.tsx"),
    read("app/layout.tsx"),
    read("components/raas/miyawaki-page.tsx"),
  ]);

  assert.match(platform, /prachurja-logo-trademark/);
  assert.match(platform, /™/);
  assert.match(metadata, /Prachurja™/);
  assert.match(miyawaki, /Prachurja™/);
});

test("assessment, content APIs and role-protected portals remain connected", async () => {
  const [route, auth, roles, admin, assessment, catalog, siteContent] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("app/chatgpt-auth.ts"),
    read("lib/portal-auth.ts"),
    read("components/admin-control-centre.tsx"),
    read("app/api/assessments/route.ts"),
    read("app/api/catalog/route.ts"),
    read("app/api/site-content/route.ts"),
  ]);

  for (const pathname of ["/client", "/partner-portal", "/field", "/admin"]) {
    assert.match(route, new RegExp(pathname.replace("/", "\\/")));
  }
  assert.match(route, /requireChatGPTUser/);
  assert.match(route, /canAccessPortal/);
  assert.match(auth, /supabase\.auth\.getUser/);
  assert.match(roles, /PRACHURJA_ADMIN_EMAILS/);
  assert.match(admin, /Catalog & content/);
  assert.match(admin, /Evidence media/);
  assert.match(assessment, /assessment_requests/);
  assert.match(catalog, /blog_posts/);
  assert.match(siteContent, /site_content/);
});

test("Sites project remains connected", async () => {
  const hosting = await read(".openai/hosting.json");
  assert.match(hosting, /"project_id":\s*"appgprj_6a5b17149a388191b14aa910acb88bf2"/);
  assert.match(hosting, /"d1":\s*"DB"/);
  assert.match(hosting, /"r2":\s*"MEDIA"/);
});
