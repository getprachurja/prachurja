import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("public website follows the RaaS proposal architecture", async () => {
  const [route, shell, home, content] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("components/raas/site-shell.tsx"),
    read("components/raas/home-page.tsx"),
    read("lib/raas-content.ts"),
  ]);

  for (const pathname of ["/solutions", "/method", "/economics", "/infrastructure", "/assessment"]) {
    assert.match(route, new RegExp(pathname.replace("/", "\\/")));
  }
  for (const removed of ["/cart", "/nursery", "/marketplace", "/blog", "/knowledge", "/services"]) {
    assert.doesNotMatch(route, new RegExp(`"${removed.replace("/", "\\/")}"`));
    assert.doesNotMatch(shell, new RegExp(`href="${removed.replace("/", "\\/")}`));
  }
  assert.match(home, /Restoration-as-a-Service/);
  assert.match(home, /₹100 Crore/);
  assert.match(home, /natural liabilities/i);
  for (const product of ["Invasive-to-Asset", "Endemic Pulse", "Miyawaki Plus", "Hydro-Ridge", "Terra-Lock", "Pyro-Shield"]) {
    assert.match(content, new RegExp(product));
  }
});

test("active restoration method includes the technical proposal", async () => {
  const [method, content] = await Promise.all([
    read("components/raas/method-page.tsx"),
    read("lib/raas-content.ts"),
  ]);
  for (const pillar of ["Active Succession", "Subterranean Health", "Trophic Catalyst"]) assert.match(content, new RegExp(pillar));
  for (const species of ["Karanj", "Palas", "Khair", "Peepal", "Umbar", "Jamun"]) assert.match(content, new RegExp(species));
  assert.match(method, /10<sup>9<\/sup>/);
  for (const measure of ["90%", "18 Liters", "3 Cups", "2 Tablespoons", "1.5 Tablespoons", "70% pioneers", "30% keystone"]) {
    assert.match(`${method}\n${content}`, new RegExp(measure));
  }
});

test("commercial model reproduces the proposal assumptions", async () => {
  const [economics, infrastructure, content] = await Promise.all([
    read("components/raas/economics-page.tsx"),
    read("components/raas/infrastructure-page.tsx"),
    read("lib/raas-content.ts"),
  ]);
  for (const amount of ["2,50,000", "1,00,000", "1,50,000"]) assert.match(economics, new RegExp(amount));
  for (const amount of ["value: 150000", "value: 60000", "value: 40000", "value: 45000", "value: 35000", "value: 20000"]) {
    assert.match(content, new RegExp(amount));
  }
  for (const amount of ["₹80,00,000", "₹25,00,000", "₹30,00,000", "₹1,35,00,000", "₹10,71,000", "1,000"]) {
    assert.match(`${infrastructure}\n${content}`, new RegExp(amount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const phase of ["Months 1–6", "Months 6–12", "Months 12–24", "Months 24+"]) assert.match(content, new RegExp(phase.replace("+", "\\+")));
  assert.match(economics, /proposal assumptions/i);
});

test("enterprise assessment writes to the secured backend", async () => {
  const [form, endpoint, backend, migration] = await Promise.all([
    read("components/raas/assessment-page.tsx"),
    read("app/api/assessments/route.ts"),
    read("lib/supabase-data.ts"),
    read("supabase/migrations/20260720000100_launch_backend.sql"),
  ]);
  assert.match(form, /fetch\("\/api\/assessments"/);
  assert.match(form, /Satellite, LiDAR & drone MRV/);
  assert.match(endpoint, /assessment_requests/);
  assert.match(endpoint, /status: "New"/);
  assert.match(backend, /SUPABASE_APP_SECRET/);
  assert.match(backend, /x-prachurja-app-key/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /private\.has_valid_app_secret/);
});

test("operational portals remain separate and role protected", async () => {
  const [route, auth, roles, admin, portals] = await Promise.all([
    read("app/[...slug]/page.tsx"),
    read("app/chatgpt-auth.ts"),
    read("lib/portal-auth.ts"),
    read("components/admin-control-centre.tsx"),
    read("components/launch-portals.tsx"),
  ]);
  for (const pathname of ["/client", "/partner-portal", "/field", "/admin"]) assert.match(route, new RegExp(pathname.replace("/", "\\/")));
  assert.match(route, /requireChatGPTUser/);
  assert.match(route, /canAccessPortal/);
  assert.match(auth, /supabase\.auth\.getUser/);
  assert.match(roles, /PRACHURJA_ADMIN_EMAILS/);
  assert.match(admin, /RaaS operations control/);
  assert.match(admin, /Evidence media/);
  assert.match(admin, /Users & roles/);
  for (const pathname of ["/client", "/partner-portal", "/field"]) assert.match(portals, new RegExp(pathname.replace("/", "\\/")));
});

test("Sites project remains connected", async () => {
  const hosting = await read(".openai/hosting.json");
  assert.match(hosting, /"project_id":\s*"appgprj_6a5b17149a388191b14aa910acb88bf2"/);
  assert.match(hosting, /"d1":\s*"DB"/);
  assert.match(hosting, /"r2":\s*"MEDIA"/);
});
