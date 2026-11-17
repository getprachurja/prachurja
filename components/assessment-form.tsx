"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCheck, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CART_STORAGE_KEY, readCart } from "@/lib/cart";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  organisation: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(8, "Enter a phone number"),
  location: z.string().trim().min(2, "Enter the site location"),
  objective: z.string().trim().min(1, "Select what you need help with"),
  message: z.string().trim().max(3000, "Keep the message under 3,000 characters").optional(),
  website: z.string().optional(),
});

type Values = z.infer<typeof schema>;
type RequestedPlant = { id: string; quantity: number };

function Field({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="form-field">
      <span>{label}{optional && <small> (optional)</small>}</span>
      {children}
      {error && <small className="error">{error}</small>}
    </label>
  );
}

const defaults: Values = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  location: "",
  objective: "Restoration project",
  message: "",
  website: "",
};

export default function AssessmentFormPage() {
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const [cartAttached, setCartAttached] = useState(0);
  const [requestedPlants, setRequestedPlants] = useState<RequestedPlant[]>([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    const items = readCart();
    if (!items.length) return;

    const timeout = window.setTimeout(() => {
      const summary = items.map((item) => `${item.quantity} × ${item.name} (${item.category})`).join(", ");
      const plants = items.flatMap((item) => item.id.startsWith("plant-")
        ? [{ id: item.id.slice("plant-".length), quantity: item.quantity }]
        : []);
      setValue("objective", "Nursery or product enquiry");
      setValue("message", `Cart enquiry: ${summary}. Please confirm availability, suitability and delivery.`);
      setCartAttached(items.reduce((count, item) => count + item.quantity, 0));
      setRequestedPlants(plants);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [setValue]);

  async function submit(data: Values) {
    setSending(true);
    setServerError("");

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          organisation: data.organisation || "Individual enquiry",
          email: data.email,
          phone: data.phone,
          clientType: "Website enquiry",
          state: data.location,
          district: data.location,
          address: data.location,
          area: "Not provided",
          unit: "Not specified",
          ownership: "Not specified",
          condition: "Not assessed",
          water: "Not assessed",
          vegetation: "Not assessed",
          objective: data.objective,
          timeline: "To be discussed",
          budget: "To be discussed",
          maintenance: "To be discussed",
          reporting: "To be discussed",
          message: data.message || "",
          website: data.website,
          cartItems: requestedPlants,
        }),
      });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) throw new Error(payload.error ?? "Unable to send your enquiry.");

      setReference(payload.reference);
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("prachurja:cart-updated"));
      setRequestedPlants([]);
      setCartAttached(0);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to send your enquiry.");
    } finally {
      setSending(false);
    }
  }

  if (reference) {
    return (
      <main className="success-page">
        <div className="success-card">
          <span className="success-icon"><Check /></span>
          <p className="eyebrow">Enquiry received</p>
          <h1>Thank you for contacting Prachurja™</h1>
          <p className="reference">Reference <b>{reference}</b></p>
          <p>Your enquiry is safely recorded. Our team will review it and contact you using the details provided.</p>
          <div className="next-step"><b>What happens next</b><span>We will get in touch within two working days to understand your requirement.</span></div>
          <div className="button-row"><a className="button button-primary" href="/">Return home</a><a className="button button-secondary" href="/nursery">Explore native plants</a></div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Send an enquiry</p>
          <h1>Tell us how we can help</h1>
          <p>Share a few basic details and the Prachurja™ team will contact you to discuss the next step.</p>
        </div>
      </section>
      <section className="section assessment-section">
        <div className="shell assessment-layout">
          <aside>
            <span className="demo-label"><span />One simple step</span>
            <h2>Just the essentials</h2>
            <p>There is no need to prepare technical site information now. We will collect anything else during the follow-up call.</p>
            {cartAttached > 0 && (
              <div className="cart-attached">
                <ClipboardCheck />
                <span><b>{cartAttached} cart {cartAttached === 1 ? "item" : "items"} attached</b>Your selected items will be reviewed with this enquiry.</span>
              </div>
            )}
            <div className="privacy-note"><FileText /><p>Your details are used only to respond to this enquiry.</p></div>
          </aside>
          <form onSubmit={handleSubmit(submit)}>
            <div className="form-head"><span>Enquiry form</span><b>Contact details</b></div>
            <input className="sr-only" tabIndex={-1} autoComplete="off" {...register("website")} />
            <div className="form-grid">
              <Field label="Your name" error={errors.name?.message}><input autoComplete="name" {...register("name")} placeholder="Full name" /></Field>
              <Field label="Organisation" optional error={errors.organisation?.message}><input autoComplete="organization" {...register("organisation")} placeholder="Company or group" /></Field>
              <Field label="Email address" error={errors.email?.message}><input type="email" autoComplete="email" {...register("email")} placeholder="name@example.com" /></Field>
              <Field label="Phone number" error={errors.phone?.message}><input type="tel" autoComplete="tel" {...register("phone")} placeholder="+91" /></Field>
              <Field label="City or site location" error={errors.location?.message}><input autoComplete="address-level2" {...register("location")} placeholder="City, district or village" /></Field>
              <Field label="What do you need help with?" error={errors.objective?.message}>
                <select {...register("objective")}>
                  <option>Restoration project</option>
                  <option>Nursery or product enquiry</option>
                  <option>Native plants or nursery</option>
                  <option>Local products</option>
                  <option>Miyawaki forest</option>
                  <option>Balcony garden</option>
                  <option>Maintenance or monitoring</option>
                  <option>Partnership or general enquiry</option>
                </select>
              </Field>
              <Field label="How can we help?" optional error={errors.message?.message}><textarea {...register("message")} placeholder="A short note about your requirement" /></Field>
            </div>
            {serverError && <p className="form-error" role="alert">{serverError}</p>}
            <div className="form-actions">
              <button className="button button-earth" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"}<ClipboardCheck /></button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
