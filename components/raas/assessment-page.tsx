"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  organisation: z.string().min(2, "Enter your organisation"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a phone number"),
  clientType: z.string().min(1),
  state: z.string().min(2, "Enter a state"),
  district: z.string().min(2, "Enter a district"),
  address: z.string().min(4, "Enter a site location"),
  area: z.string().min(1, "Enter the project area"),
  unit: z.string(),
  ownership: z.string(),
  condition: z.string(),
  water: z.string(),
  vegetation: z.string().min(2, "Describe the current vegetation or liability"),
  objective: z.string().min(1),
  timeline: z.string(),
  budget: z.string(),
  maintenance: z.string(),
  reporting: z.string(),
  message: z.string().optional(),
  website: z.string().optional(),
});

type Values = z.infer<typeof schema>;

const defaults: Values = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  clientType: "Corporate ESG / Compliance",
  state: "",
  district: "",
  address: "",
  area: "",
  unit: "hectares",
  ownership: "Private / Corporate",
  condition: "Invasive-dominated land",
  water: "Seasonal",
  vegetation: "",
  objective: "Invasive-to-Asset™",
  timeline: "Months 1–6",
  budget: "To be scoped",
  maintenance: "Regional RaaS programme",
  reporting: "Satellite, LiDAR & drone MRV",
  message: "",
  website: "",
};

const steps = ["Organisation", "Natural liability", "RaaS system", "Review"];

export function RaasAssessmentPage() {
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, trigger, control, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  const values = useWatch({ control });

  async function next() {
    const fields: Record<number, (keyof Values)[]> = {
      1: ["name", "organisation", "email", "phone", "clientType"],
      2: ["state", "district", "address", "area", "vegetation"],
      3: ["objective"],
    };
    if (await trigger(fields[step] ?? [])) setStep(Math.min(4, step + 1));
  }

  async function submit(data: Values) {
    setSending(true);
    setServerError("");
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) throw new Error(payload.error ?? "Unable to submit this project scope.");
      setReference(payload.reference);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to submit this project scope.");
    } finally {
      setSending(false);
    }
  }

  if (reference) {
    return (
      <main className="raas-assessment-success">
        <div>
          <Check />
          <p>Project scope received</p>
          <h1>Your Restoration-as-a-Service enquiry is recorded.</h1>
          <span>Reference <b>{reference}</b></span>
          <p>Prachurja can now review the natural liability, selected engineered system, regional capacity and MRV requirement.</p>
          <a className="raas-button raas-button-mint" href="/">Return to overview <ArrowRight /></a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="raas-assessment-hero">
        <div className="raas-shell">
          <p className="raas-eyebrow raas-eyebrow-light"><span />Enterprise project assessment</p>
          <h1>Define the natural liability.<br /><em>Engineer the living asset.</em></h1>
          <p>Structure the first conversation around site scale, enterprise mandate, RaaS system and digital verification requirement.</p>
        </div>
      </section>
      <section className="raas-section raas-assessment-section">
        <div className="raas-shell raas-assessment-layout">
          <aside>
            <p>Project scoping</p>
            <ol>{steps.map((item, index) => <li className={index + 1 === step ? "active" : index + 1 < step ? "done" : ""} key={item}><span>{index + 1 < step ? <Check /> : index + 1}</span><b>{item}</b></li>)}</ol>
            <div><ShieldCheck /><p>Submitted information is stored securely for Prachurja’s enterprise assessment workflow.</p></div>
          </aside>
          <form onSubmit={handleSubmit(submit)}>
            <header><span>0{step} / 04</span><h2>{steps[step - 1]}</h2></header>
            <input className="sr-only" tabIndex={-1} autoComplete="off" {...register("website")} />
            {step === 1 && <div className="raas-form-grid">
              <Field label="Name" error={errors.name?.message}><input {...register("name")} /></Field>
              <Field label="Organisation" error={errors.organisation?.message}><input {...register("organisation")} /></Field>
              <Field label="Corporate email" error={errors.email?.message}><input type="email" {...register("email")} /></Field>
              <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} placeholder="+91" /></Field>
              <Field label="Enterprise pathway"><select {...register("clientType")}><option>Corporate ESG / Compliance</option><option>Government / Forest Department</option><option>Land Reclamation Programme</option><option>Conservation Infrastructure Partner</option></select></Field>
            </div>}
            {step === 2 && <div className="raas-form-grid">
              <Field label="State" error={errors.state?.message}><input {...register("state")} /></Field>
              <Field label="District" error={errors.district?.message}><input {...register("district")} /></Field>
              <Field label="Site / regional location" error={errors.address?.message}><input {...register("address")} /></Field>
              <Field label="Project area" error={errors.area?.message}><input type="number" min="0" step="any" {...register("area")} /></Field>
              <Field label="Area unit"><select {...register("unit")}><option>hectares</option><option>acres</option><option>square kilometres</option></select></Field>
              <Field label="Land control"><select {...register("ownership")}><option>Private / Corporate</option><option>Government</option><option>Community</option><option>Leasehold / Concession</option></select></Field>
              <Field label="Natural liability"><select {...register("condition")}><option>Invasive-dominated land</option><option>Degraded forest system</option><option>Land-reclamation site</option><option>Water-stressed slopes</option><option>Fragile monsoon soil</option><option>Fire-exposed forest edge</option></select></Field>
              <Field label="Water regime"><select {...register("water")}><option>Seasonal</option><option>Year-round</option><option>Water-stressed</option><option>Unknown</option></select></Field>
              <Field label="Current vegetation / liability" error={errors.vegetation?.message} full><textarea {...register("vegetation")} placeholder="Invasive species, remnant forest, erosion, soil condition and known constraints." /></Field>
            </div>}
            {step === 3 && <div className="raas-system-options">
              {["Invasive-to-Asset™", "Endemic Pulse™", "Miyawaki Plus™", "Hydro-Ridge™ Networks", "Terra-Lock™ Soil Armor", "Pyro-Shield™ Firebreaks"].map((item) => <label className={values.objective === item ? "selected" : ""} key={item}><input type="radio" value={item} {...register("objective")} /><span>{item}</span><Check /></label>)}
              <div className="raas-form-grid">
                <Field label="Programme phase"><select {...register("timeline")}><option>Months 1–6</option><option>Months 6–12</option><option>Months 12–24</option><option>Months 24+</option></select></Field>
                <Field label="Commercial scale"><select {...register("budget")}><option>To be scoped</option><option>Below ₹1 crore</option><option>₹1–5 crore</option><option>₹5–25 crore</option><option>Regional module / strategic partnership</option></select></Field>
                <Field label="Delivery model"><select {...register("maintenance")}><option>Regional RaaS programme</option><option>Single engineered system</option><option>Multi-system restoration asset</option></select></Field>
                <Field label="Verification requirement"><select {...register("reporting")}><option>Satellite, LiDAR & drone MRV</option><option>Drone growth tracking</option><option>Thermal-grid monitoring</option><option>Digital MRV / credit registry</option><option>To be scoped</option></select></Field>
                <Field label="Mandate, compliance or ESG context" full><textarea {...register("message")} placeholder="Compensatory afforestation, land reclamation, corporate ESG, carbon or other mandate." /></Field>
              </div>
            </div>}
            {step === 4 && <div className="raas-review">
              <Review label="Organisation" value={`${values.organisation}\n${values.name} · ${values.email}`} onEdit={() => setStep(1)} />
              <Review label="Natural liability" value={`${values.condition}\n${values.area} ${values.unit} · ${values.district}, ${values.state}`} onEdit={() => setStep(2)} />
              <Review label="Engineered system" value={`${values.objective}\n${values.maintenance} · ${values.reporting}`} onEdit={() => setStep(3)} />
            </div>}
            {serverError && <p className="form-error" role="alert">{serverError}</p>}
            <footer>
              {step > 1 && <button type="button" className="raas-button raas-button-plain" onClick={() => setStep(step - 1)}>Back</button>}
              {step < 4
                ? <button type="button" className="raas-button raas-button-dark" onClick={next}>Continue <ArrowRight /></button>
                : <button type="submit" className="raas-button raas-button-dark" disabled={sending}>{sending ? "Submitting…" : "Submit project scope"}<ClipboardCheck /></button>}
            </footer>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, full = false, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return <label className={full ? "full" : ""}><span>{label}</span>{children}{error && <small>{error}</small>}</label>;
}

function Review({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return <article><span>{label}</span><p>{value}</p><button type="button" onClick={onEdit}>Edit</button></article>;
}
