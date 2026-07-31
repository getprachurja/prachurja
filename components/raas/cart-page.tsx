"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/raas/cart-context";
import { PageHero } from "@/components/raas/shared";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function CartPage() {
  const { items, count, total, hydrated, setQuantity, removeItem, clear } = useCart();

  if (!hydrated) {
    return <main><PageHero eyebrow="Your nursery cart" title="Loading your plant list." copy="Your saved nursery selections are being prepared." /></main>;
  }

  if (!items.length) {
    return (
      <main>
        <PageHero eyebrow="Your nursery cart" title="Build a native plant enquiry." copy="Add plants from the nursery, then bring the list into a site assessment for availability and suitability confirmation." />
        <section className="raas-section">
          <div className="raas-shell raas-cart-empty">
            <ShoppingBag aria-hidden="true" />
            <h2>Your cart is empty</h2>
            <p>Browse native planting stock by ecological role, region and water requirement.</p>
            <Link className="raas-button raas-button-primary" href="/nursery">Explore native plants <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero eyebrow="Your nursery cart" title="Review your plant enquiry." copy="Adjust quantities, then attach this list to your site details for availability, provenance, delivery and final-price confirmation." />
      <section className="raas-section raas-cart-section">
        <div className="raas-shell raas-cart-layout">
          <div className="raas-cart-list">
            <header><b>{count} {count === 1 ? "plant" : "plants"}</b><button type="button" onClick={clear}>Clear cart</button></header>
            {items.map((item) => (
              <article key={item.id}>
                <img src={item.imageUrl} alt="" />
                <div>
                  <span>Native plant</span>
                  <h2><Link href={`/plants/${item.id}`}>{item.commonName}</Link></h2>
                  <i>{item.botanicalName}</i>
                  <small>{money.format(item.unitPrice)} indicative each</small>
                </div>
                <div className="raas-cart-item-actions">
                  <div aria-label={`Quantity for ${item.commonName}`}>
                    <button type="button" aria-label={`Decrease ${item.commonName} quantity`} onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus aria-hidden="true" /></button>
                    <output>{item.quantity}</output>
                    <button type="button" aria-label={`Increase ${item.commonName} quantity`} onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus aria-hidden="true" /></button>
                  </div>
                  <strong>{money.format(item.unitPrice * item.quantity)}</strong>
                  <button type="button" onClick={() => removeItem(item.id)}><Trash2 aria-hidden="true" /> Remove</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="raas-cart-summary">
            <p className="raas-eyebrow"><span />Enquiry summary</p>
            <div><span>Indicative subtotal</span><strong>{money.format(total)}</strong></div>
            <p>Final availability, minimum quantities, provenance, taxes and delivery are confirmed after review.</p>
            <Link className="raas-button raas-button-primary" href="/assessment">Continue to site details <ArrowRight aria-hidden="true" /></Link>
            <Link href="/nursery">Continue browsing</Link>
            <small><b>No payment is taken here.</b> This creates a nursery quotation request, not a confirmed order.</small>
          </aside>
        </div>
      </section>
    </main>
  );
}
