import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const catalogue = JSON.parse(read("data/plant-catalogue.json"));

test("the supplied planting palette is complete and grouped into four vegetation layers", () => {
  assert.deepEqual(Object.keys(catalogue), ["Shrub Layer", "Sub-Tree Layer", "Tree Layer", "Canopy Tree Layer"]);
  assert.equal(catalogue["Shrub Layer"].length, 40);
  assert.equal(catalogue["Sub-Tree Layer"].length, 50);
  assert.equal(catalogue["Tree Layer"].length, 43);
  assert.equal(catalogue["Canopy Tree Layer"].length, 17);
  const species = Object.values(catalogue).flat();
  assert.equal(species.length, 150);
  assert.equal(new Set(species).size, 150);
});

test("catalogue UI, details, admin editing and botanical-image resolution use the layer model", () => {
  const platform = read("components/platform-app.tsx");
  const admin = read("components/admin-content-manager.tsx");
  const api = read("app/api/plant-image/route.ts");
  const schema = read("app/api/admin/content/route.ts");
  const migration = read("supabase/migrations/20260825143000_categorize_full_plant_catalogue.sql");

  for (const layer of Object.keys(catalogue)) assert.match(platform, new RegExp(layer.replace("-", "\\-")));
  assert.match(platform, /layer-overview/);
  assert.match(platform, /Vegetation layer/);
  assert.match(platform, /plant\.layer/);
  assert.match(platform, /mergePlantCatalogue/);
  assert.match(admin, /Vegetation layer/);
  assert.match(schema, /Shrub Layer/);
  assert.match(api, /en\.wikipedia\.org\/api\/rest_v1\/page\/summary/);
  assert.match(api, /commons\.wikimedia\.org\/w\/api\.php/);
  assert.match(api, /hero-restoration\.png/);
  assert.match(migration, /catalog_plants_layer_check/);
});
