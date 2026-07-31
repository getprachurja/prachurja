import { fallbackPlants, type NurseryPlant } from "@/lib/nursery";
import { selectRows } from "@/lib/supabase-data";

type PlantRow = Omit<NurseryPlant, "price"> & { price: number | string };

function normalize(rows: PlantRow[]): NurseryPlant[] {
  return rows.map((row) => ({ ...row, price: Number(row.price) }));
}

export async function getCatalogPlants(): Promise<NurseryPlant[]> {
  try {
    const rows = await selectRows<PlantRow>("catalog_plants", {
      filters: { active: true },
      order: { column: "sort_order", ascending: true },
      limit: 100,
    });
    return rows.length ? normalize(rows) : fallbackPlants;
  } catch {
    return fallbackPlants;
  }
}

export async function getCatalogPlant(id: string): Promise<NurseryPlant | null> {
  try {
    const [row] = await selectRows<PlantRow>("catalog_plants", {
      filters: { id, active: true },
      limit: 1,
    });
    if (row) return normalize([row])[0];
  } catch {
    // The curated fallback keeps the public nursery useful during a transient data outage.
  }
  return fallbackPlants.find((plant) => plant.id === id) ?? null;
}
