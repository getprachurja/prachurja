import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("includes durable launch workflows and secured Supabase migrations", async () => {
  const [hosting, migration, assessment, partner, companion, backend, mediaFunction] = await Promise.all([
    read(".openai/hosting.json"),
    read("supabase/migrations/20260720000100_launch_backend.sql"),
    read("app/api/assessments/route.ts"),
    read("app/api/partners/route.ts"),
    read("app/api/ai/route.ts"),
    read("lib/supabase-data.ts"),
    read("supabase/functions/prachurja-media/index.ts"),
  ]);

  assert.match(hosting, /"d1":\s*"DB"/);
  assert.match(hosting, /"r2":\s*"MEDIA"/);
  for (const table of ["assessment_requests", "partner_applications", "portal_members", "portal_access_requests", "nursery_inventory", "field_reports", "contact_messages", "site_content", "media_assets"]) {
    assert.match(migration, new RegExp(table));
  }
  assert.match(migration, /enable row level security/);
  assert.match(migration, /private\.has_valid_app_secret/);
  assert.match(assessment, /status:\s*"New"/);
  assert.match(partner, /partner_applications/);
  assert.match(companion, /api\.groq\.com\/openai\/v1\/chat\/completions/);
  assert.match(companion, /GROQ_API_KEY/);
  assert.match(companion, /fallbackAnswer/);
  assert.match(backend, /SUPABASE_APP_SECRET/);
  assert.match(backend, /x-prachurja-app-key/);
  assert.match(mediaFunction, /prachurja-media/);
});

test("protects every operational portal with server-side identity and roles", async () => {
  const [route, auth, portal, app, knowledge] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("app/chatgpt-auth.ts"),
    read("lib/portal-auth.ts"),
    read("components/platform-app.tsx"),
    read("components/knowledge-hub.tsx"),
  ]);

  for (const pathname of ["/client", "/partner-portal", "/field", "/admin"]) assert.match(route, new RegExp(pathname.replace("/", "\\/")));
  assert.match(route, /requireChatGPTUser/);
  assert.match(route, /canAccessPortal/);
  assert.match(auth, /createSupabaseServerClient/);
  assert.match(auth, /supabase\.auth\.getUser/);
  assert.match(portal, /PRACHURJA_ADMIN_EMAILS/);
  assert.match(app, /AiCompanion/);
  assert.doesNotMatch(knowledge, /href="#"/);
});

test("build output contains the production worker", async () => {
  const worker = await read("dist/server/index.js");
  assert.match(worker, /prachurja/i);
});

test("ships a dedicated cart, Prach companion, distinct services, and complete footer routes", async () => {
  const [app, cart, companion, services] = await Promise.all([
    read("components/platform-app.tsx"),
    read("components/cart-page.tsx"),
    read("components/ai-companion.tsx"),
    read("lib/mock-data.ts"),
  ]);
  assert.match(app, /path==="\/cart"/);
  assert.match(app, /href="\/cart"/);
  assert.match(cart, /Continue to assessment/);
  assert.match(companion, /Prach companion/);
  for (const id of ["landscape", "regeneration", "urban", "greenbelt", "agroforestry", "watershed", "soil", "invasives"]) assert.match(services, new RegExp(`${id}:`));
  for (const route of ["/about", "/blog", "/contact", "/delivery", "/privacy", "/terms"]) assert.match(app, new RegExp(route.replace("/", "\\/")));
});

test("provides a real administrator control centre", async () => {
  const [control, manager, contentApi, catalogueApi, siteContentApi, mediaApi, membersApi, portals, migration] = await Promise.all([
    read("components/admin-control-centre.tsx"),
    read("components/admin-content-manager.tsx"),
    read("app/api/admin/content/route.ts"),
    read("app/api/catalog/route.ts"),
    read("app/api/site-content/route.ts"),
    read("app/api/admin/media/route.ts"),
    read("app/api/admin/members/route.ts"),
    read("components/launch-portals.tsx"),
    read("supabase/migrations/20260721114408_admin_content_management.sql"),
  ]);
  assert.match(control, /Website control centre/);
  assert.match(control, /Upload to library/);
  assert.match(control, /Users and roles/);
  for (const label of ["Plants & trees", "Local products", "Blogs & guides", "Projects & impact"]) assert.match(manager, new RegExp(label.replace("&", "&")));
  assert.match(contentApi, /Administrator access required/);
  assert.match(catalogueApi, /catalog_plants/);
  assert.match(siteContentApi, /Administrator access required/);
  assert.match(mediaApi, /supabaseFunctionUrl/);
  assert.match(membersApi, /portal_members/);
  for (const table of ["catalog_plants", "marketplace_products", "blog_posts", "restoration_projects"]) assert.match(migration, new RegExp(table));
  for (const route of ["/client", "/partner-portal", "/field"]) assert.match(portals, new RegExp(route.replace("/", "\\/")));
});
