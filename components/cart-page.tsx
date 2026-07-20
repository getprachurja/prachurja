"use client";
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { cartTotal, type CartItem } from "@/lib/cart";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function CartPage({ items, onQuantity, onRemove, onClear }: {
  items: CartItem[];
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const total = cartTotal(items);

  if (!items.length) return <main className="cart-page"><section className="page-hero"><div className="shell"><p className="eyebrow">Your cart</p><h1>Build your restoration enquiry</h1><p>Add native plants or local products, then return here to review quantities before requesting a confirmed quotation.</p></div></section><section className="section"><div className="shell cart-empty"><span><ShoppingBag/></span><h2>Your cart is empty</h2><p>Browse the native nursery or local marketplace to begin an enquiry.</p><div className="button-row"><a className="button button-primary" href="/nursery">Explore native plants</a><a className="button button-secondary" href="/marketplace">Browse local products</a></div></div></section></main>;

  return <main className="cart-page"><section className="page-hero"><div className="shell"><p className="eyebrow">Your cart</p><h1>Review your restoration enquiry</h1><p>Adjust quantities and attach this list to a site assessment for availability, delivery and suitability confirmation.</p></div></section><section className="section"><div className="shell cart-layout"><div className="cart-list"><div className="cart-list-head"><b>{items.length} {items.length === 1 ? "item" : "items"}</b><button className="text-button" onClick={onClear}>Clear cart</button></div>{items.map((item) => <article className="cart-item" key={item.id}>{item.image ? <img src={item.image} alt=""/> : <span className="cart-item-placeholder"><ShoppingBag/></span>}<div className="cart-item-copy"><span>{item.category}</span><a href={item.href}><h2>{item.name}</h2></a><p>{item.subtitle}</p><b>{money.format(item.unitPrice)} <small>indicative each</small></b></div><div className="cart-item-actions"><div className="cart-quantity" aria-label={`Quantity for ${item.name}`}><button onClick={() => onQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}><Minus/></button><output>{item.quantity}</output><button onClick={() => onQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}><Plus/></button></div><strong>{money.format(item.unitPrice * item.quantity)}</strong><button className="cart-remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}><Trash2/> Remove</button></div></article>)}</div><aside className="cart-summary"><p className="eyebrow">Enquiry summary</p><div><span>Indicative subtotal</span><strong>{money.format(total)}</strong></div><p>Final prices, taxes, minimum order quantities, plant provenance, suitability and delivery are confirmed after review.</p><a className="button button-earth" href="/assessment">Continue to assessment <ArrowRight/></a><a className="cart-continue" href="/nursery">Continue browsing</a><div className="cart-assurance"><b>No payment is taken here</b><span>This cart creates a quotation request, not a confirmed order.</span></div></aside></div></section></main>;
}
