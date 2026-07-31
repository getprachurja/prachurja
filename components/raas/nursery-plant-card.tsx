"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/raas/cart-context";
import type { NurseryPlant } from "@/lib/nursery";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function NurseryPlantCard({ plant }: { plant: NurseryPlant }) {
  const { addPlant } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addPlant(plant);
    setAdded(true);
  }

  return (
    <article className="raas-plant-card" data-testid={`plant-card-${plant.id}`}>
      <Link className="raas-plant-image" href={`/plants/${plant.id}`}>
        <img src={plant.imageUrl} alt={`${plant.commonName}, ${plant.botanicalName}`} loading="lazy" />
        <span>{plant.stockStatus}</span>
      </Link>
      <div className="raas-plant-card-body">
        <p>{plant.ecologicalRole}</p>
        <h3><Link href={`/plants/${plant.id}`}>{plant.commonName}</Link></h3>
        <i>{plant.botanicalName}</i>
        <dl>
          <div><dt>Native region</dt><dd>{plant.region}</dd></div>
          <div><dt>Water</dt><dd>{plant.waterRequirement}</dd></div>
          <div><dt>Plant size</dt><dd>{plant.plantSize}</dd></div>
        </dl>
        <div className="raas-plant-price">
          <strong>{money.format(plant.price)}</strong>
          <span>Indicative per plant</span>
        </div>
        <div className="raas-plant-actions">
          <button type="button" onClick={add} aria-label={`Add ${plant.commonName} to cart`}>
            {added ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {added ? "Added" : "Add to cart"}
          </button>
          <Link href={`/plants/${plant.id}`}>View details</Link>
        </div>
      </div>
    </article>
  );
}
