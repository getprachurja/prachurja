"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/raas/cart-context";
import type { NurseryPlant } from "@/lib/nursery";
import { getPlantFieldProfile } from "@/lib/plant-profiles";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function PlantDetailPage({ plant }: { plant: NurseryPlant }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addPlant } = useCart();
  const profile = getPlantFieldProfile(plant);

  function add() {
    addPlant(plant, quantity);
    setAdded(true);
  }

  return (
    <main>
      <section className="raas-plant-detail">
        <div className="raas-shell">
          <Link className="raas-back-link" href="/nursery"><ArrowLeft aria-hidden="true" /> Native nursery</Link>
          <div className="raas-plant-detail-grid">
            <figure>
              <img src={plant.imageUrl} alt={`${plant.commonName}, ${plant.botanicalName}`} />
              <figcaption>Species reference photograph</figcaption>
            </figure>
            <div className="raas-plant-detail-copy">
              <div className="raas-plant-tags"><span>{plant.ecologicalRole}</span><span>{plant.stockStatus}</span></div>
              <p className="raas-eyebrow"><span />Native species profile</p>
              <h1>{plant.commonName}</h1>
              <i>{plant.botanicalName}</i>
              <p>{plant.description || "A native nursery reference for locally appropriate planting and restoration planning."}</p>
              <dl>
                <div><dt>Native region</dt><dd>{plant.region}</dd></div>
                <div><dt>Water requirement</dt><dd>{plant.waterRequirement}</dd></div>
                <div><dt>Current plant size</dt><dd>{plant.plantSize}</dd></div>
                <div><dt>Ecological role</dt><dd>{plant.ecologicalRole}</dd></div>
              </dl>
              <div className="raas-detail-price"><strong>{money.format(plant.price)}</strong><span>Indicative per plant · taxes and delivery confirmed on review</span></div>
              <div className="raas-detail-buy">
                <div aria-label={`Quantity for ${plant.commonName}`}>
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus aria-hidden="true" /></button>
                  <output>{quantity}</output>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(999, current + 1))}><Plus aria-hidden="true" /></button>
                </div>
                <button type="button" className="raas-button raas-button-primary" onClick={add}>
                  {added ? <Check aria-hidden="true" /> : <ShoppingBag aria-hidden="true" />}
                  {added ? `${quantity} added` : "Add to cart"}
                </button>
              </div>
              <div className="raas-suitability-note">
                <ShieldCheck aria-hidden="true" />
                <p><b>Suitability check required.</b> Final selection depends on local ecology, seed source, soil, water and available establishment care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="raas-section raas-field-reference">
        <div className="raas-shell raas-field-reference-grid">
          <div>
            <header>
              <p className="raas-eyebrow"><span />Field reference</p>
              <h2>Species characteristics</h2>
              <p>Planning guidance for an initial nursery review. Final specifications follow local provenance and site checks.</p>
            </header>
            <dl className="raas-spec-table">
              {profile.fieldRows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}
            </dl>
          </div>
          <aside className="raas-care-card">
            <p className="raas-eyebrow"><span />Planting reference</p>
            <h3>Planting &amp; care</h3>
            <ul>{profile.care.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>Recommended uses</h3>
            <div className="raas-use-chips">{profile.recommendedUses.map((use) => <span key={use}>{use}</span>)}</div>
            <h3>Companion community</h3>
            <p>{profile.companions}</p>
            <h3>Available batches</h3>
            <p>Current batch, provenance and dispatch readiness are confirmed with your enquiry.</p>
          </aside>
        </div>
      </section>
      <section className="raas-section raas-plant-care">
        <div className="raas-shell">
          <header>
            <p className="raas-eyebrow"><span />Before planting</p>
            <h2>A nursery order is one part of the restoration decision.</h2>
          </header>
          <ol>
            <li><span>01</span><div><h3>Validate provenance</h3><p>Confirm that the seed source and growing conditions are appropriate for the receiving landscape.</p></div></li>
            <li><span>02</span><div><h3>Read the site</h3><p>Match species to soil, drainage, sunlight, space and the intended ecological function.</p></div></li>
            <li><span>03</span><div><h3>Plan establishment</h3><p>Prepare the planting window, water, mulch, protection, replacements and monitoring before dispatch.</p></div></li>
          </ol>
        </div>
      </section>
    </main>
  );
}
