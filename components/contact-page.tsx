"use client";

import { useState } from "react";
import { ArrowRight, Check, Clock3, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) throw new Error(payload.error ?? "Your message could not be sent.");
      setReference(payload.reference);
      event.currentTarget.reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Your message could not be sent."); }
    finally { setSending(false); }
  }

  return <main><section className="page-hero"><div className="shell"><p className="eyebrow">Contact Prachurja</p><h1>Tell us what you are trying to restore</h1><p>Use the general enquiry form below, or choose the specialist pathway that best matches your need.</p></div></section><section className="section"><div className="shell contact-layout"><aside className="contact-aside"><p className="eyebrow">The quickest route</p><h2>Start in the right place</h2><a href="/assessment"><span>Land restoration or CSR project</span><ArrowRight/></a><a href="/nursery"><span>Native plant availability</span><ArrowRight/></a><a href="/partner"><span>Nursery, supplier or field partnership</span><ArrowRight/></a><a href="/delivery"><span>Orders and delivery support</span><ArrowRight/></a><div className="contact-facts"><p><MapPin/><span><b>Service area</b>Restoration enquiries across India</span></p><p><Clock3/><span><b>Response target</b>Within two working days</span></p><p><Mail/><span><b>Reference tracking</b>Every message receives a unique reference</span></p></div></aside><div className="contact-form-card">{reference ? <div className="contact-success"><Check/><p className="eyebrow">Message received</p><h2>Thank you for contacting us</h2><p>Your reference is <b>{reference}</b>. Keep it for follow-up.</p><button className="button button-secondary" onClick={() => setReference("")}>Send another message</button></div> : <form onSubmit={submit}><p className="eyebrow">General enquiry</p><h2>How can we help?</h2><div className="form-grid"><label className="form-field"><span>Name</span><input name="name" minLength={2} required/></label><label className="form-field"><span>Organisation</span><input name="organisation" minLength={2} required/></label><label className="form-field"><span>Email</span><input name="email" type="email" required/></label><label className="form-field"><span>Phone (optional)</span><input name="phone"/></label><label className="form-field"><span>Subject</span><select name="subject" required><option>General enquiry</option><option>Native plant order</option><option>Restoration service</option><option>Partnership</option><option>Portal support</option><option>Media or research</option></select></label><label className="form-field full"><span>Message</span><textarea name="message" minLength={10} maxLength={2500} required placeholder="Share your location, objective and question."/></label></div><input className="sr-only" name="website" tabIndex={-1} autoComplete="off"/>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-earth" disabled={sending}>{sending ? "Sending…" : "Send message"}<ArrowRight/></button><small>We use these details only to respond to this enquiry.</small></form>}</div></div></section></main>;
}
