"use client";

import { Grid2X2, Search, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { NurseryPlantCard } from "@/components/raas/nursery-plant-card";
import { PageHero } from "@/components/raas/shared";
import type { NurseryPlant } from "@/lib/nursery";

type WaterFilter = "All" | NurseryPlant["waterRequirement"];

export function NurseryPage({ plants }: { plants: NurseryPlant[] }) {
  const [query, setQuery] = useState("");
  const [water, setWater] = useState<WaterFilter>("All");
  const [sort, setSort] = useState("ecological");
  const [shown, setShown] = useState(9);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    const result = plants.filter((plant) => {
      const matchesQuery = !deferredQuery || `${plant.commonName} ${plant.botanicalName} ${plant.ecologicalRole} ${plant.region}`.toLowerCase().includes(deferredQuery);
      return matchesQuery && (water === "All" || plant.waterRequirement === water);
    });
    if (sort === "price") return result.toSorted((a, b) => a.price - b.price);
    if (sort === "name") return result.toSorted((a, b) => a.commonName.localeCompare(b.commonName));
    if (sort === "availability") return result.toSorted((a, b) => a.stockStatus.localeCompare(b.stockStatus));
    return result;
  }, [deferredQuery, plants, sort, water]);

  function reset() {
    setQuery("");
    setWater("All");
    setShown(9);
  }

  return (
    <main>
      <PageHero
        eyebrow="Prachurja native nursery"
        title="Right plant. Right place. Right function."
        copy="Explore native planting stock by ecological role and water need. Availability, provenance and final suitability are confirmed before dispatch."
      />
      <section className="raas-section raas-nursery-section">
        <div className="raas-shell">
          <div className="raas-catalogue-toolbar">
            <label className="raas-catalogue-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search native plants</span>
              <input
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setShown(9); }}
                placeholder="Search name, species, role or region"
              />
            </label>
            <label className="raas-catalogue-sort">
              <span>Sort plants</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="ecological">Ecological relevance</option>
                <option value="price">Price: low to high</option>
                <option value="name">Name: A to Z</option>
                <option value="availability">Availability</option>
              </select>
            </label>
          </div>

          <div className="raas-catalogue-meta">
            <div>
              <Grid2X2 aria-hidden="true" />
              <b>{filtered.length} native species</b>
              <span>Indicative nursery batches</span>
            </div>
            <button type="button" onClick={reset}>Clear filters</button>
          </div>

          <div className="raas-catalogue-layout">
            <aside className="raas-catalogue-filters">
              <div><SlidersHorizontal aria-hidden="true" /><b>Filter plants</b></div>
              <fieldset>
                <legend>Water requirement</legend>
                {(["All", "Low", "Moderate", "High"] as WaterFilter[]).map((option) => (
                  <button
                    type="button"
                    className={water === option ? "active" : ""}
                    aria-pressed={water === option}
                    onClick={() => { setWater(option); setShown(9); }}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </fieldset>
              <p>Final species choice must reflect the local reference ecosystem, seed provenance, soil, water and planting objective.</p>
            </aside>

            <div>
              {filtered.length ? (
                <div className="raas-plant-grid">
                  {filtered.slice(0, shown).map((plant) => <NurseryPlantCard plant={plant} key={plant.id} />)}
                </div>
              ) : (
                <div className="raas-catalogue-empty">
                  <h2>No matching plants</h2>
                  <p>Try a different name or water requirement, or ask Prach for guidance.</p>
                  <button type="button" className="raas-button raas-button-secondary" onClick={reset}>Reset catalogue</button>
                </div>
              )}
              {shown < filtered.length ? (
                <button type="button" className="raas-button raas-button-secondary raas-load-more" onClick={() => setShown((current) => current + 6)}>
                  Load more plants
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
