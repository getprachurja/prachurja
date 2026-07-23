"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  organisation: z.string().min(2, "Enter your organisation or group"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a phone number"),
  clientType: z.string().min(1),
  state: z.string().min(2, "Enter a state"),
  district: z.string().min(2, "Enter a district"),
  address: z.string().min(4, "Enter the site location"),
  area: z.string().min(1, "Enter the approximate area"),
  unit: z.string(),
  ownership: z.string(),
  condition: z.string(),
  water: z.string(),
  vegetation: z.string().min(2, "Describe the site as it is today"),
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
  clientType: "Landholder / Organisation",
  state: "",
  district: "",
  address: "",
  area: "",
  unit: "hectares",
  ownership: "Private / Organisational",
  condition: "Degraded or low-cover land",
  water: "Seasonal",
  vegetation: "",
  objective: "Site assessment and restoration plan",
  timeline: "Exploring options",
  budget: "Discuss after assessment",
  maintenance: "Prachurja-supported establishment",
  reporting: "Field records and photo monitoring",
  message: "",
  website: "",
};

const steps = ["About you", "About the land", "What you need", "Review"];

export function RaasAssessmentPage() {
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
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
      const payload = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) {
        throw new Error(payload.error ?? "Unable to submit this site assessment.");
      }
      setReference(payload.reference);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to submit this site assessment.");
    } finally {
      setSending(false);
    }
  }

  if (reference) {
    return (
      <main className="raas-assessment-success">
        <div>
          <Check aria-hidden="true" />
          <p>Site details received</p>
          <h1>Thank you. We can begin with the land.</h1>
          <span>Reference <b>{reference}</b></span>
          <p>
            Prachurja can now review the current condition, intended outcome and
            most useful next step.
          </p>
          <a className="raas-button raas-button-primary" href="/">
            Return home
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="raas-page-hero raas-assessment-hero">
        <div className="raas-shell">
          <p className="raas-eyebrow"><span />Site assessment</p>
          <h1>Tell us about the land.</h1>
          <p>
            A few practical details help us understand whether restoration,
            Miyawaki planting or another pathway may be suitable.
          </p>
        </div>
      </section>
      <section className="raas-section raas-assessment-section">
        <div className="raas-shell raas-assessment-layout">
          <aside>
            <p>Your assessment</p>
            <ol>
              {steps.map((item, index) => (
                <li
                  className={index + 1 === step ? "active" : index + 1 < step ? "done" : ""}
                  key={item}
                >
                  <span>{index + 1 < step ? <Check aria-hidden="true" /> : index + 1}</span>
                  <b>{item}</b>
                </li>
              ))}
            </ol>
            <div>
              <ShieldCheck aria-hidden="true" />
              <p>Your information is stored securely for Prachurja’s assessment workflow.</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit(submit)}>
            <header>
              <span>0{step} / 04</span>
              <h2>{steps[step - 1]}</h2>
            </header>
            <input className="sr-only" tabIndex={-1} autoComplete="off" {...register("website")} />

            {step === 1 && (
              <div className="raas-form-grid">
                <Field label="Name" error={errors.name?.message}><input autoComplete="name" {...register("name")} /></Field>
                <Field label="Organisation or group" error={errors.organisation?.message}><input autoComplete="organization" {...register("organisation")} /></Field>
                <Field label="Email" error={errors.email?.message}><input type="email" autoComplete="email" {...register("email")} /></Field>
                <Field label="Phone" error={errors.phone?.message}><input autoComplete="tel" {...register("phone")} placeholder="+91" /></Field>
                <Field label="You are enquiring as">
                  <select {...register("clientType")}>
                    <option>Landholder / Organisation</option>
                    <option>Community or nonprofit</option>
                    <option>Institution or campus</option>
                    <option>Corporate or industry</option>
                    <option>Government body</option>
                  </select>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="raas-form-grid">
                <Field label="State" error={errors.state?.message}><input {...register("state")} /></Field>
                <Field label="District" error={errors.district?.message}><input {...register("district")} /></Field>
                <Field label="Site location" error={errors.address?.message}><input {...register("address")} /></Field>
                <Field label="Approximate area" error={errors.area?.message}><input type="number" min="0" step="any" {...register("area")} /></Field>
                <Field label="Area unit">
                  <select {...register("unit")}><option>hectares</option><option>acres</option><option>square metres</option></select>
                </Field>
                <Field label="Land relationship">
                  <select {...register("ownership")}><option>Private / Organisational</option><option>Government</option><option>Community</option><option>Leasehold / Managed</option></select>
                </Field>
                <Field label="Current condition">
                  <select {...register("condition")}><option>Degraded or low-cover land</option><option>Invasive-dominated land</option><option>Compact urban plot</option><option>Erosion-prone slope</option><option>Water-stressed site</option><option>Existing woodland needing care</option><option>Not sure yet</option></select>
                </Field>
                <Field label="Water availability">
                  <select {...register("water")}><option>Seasonal</option><option>Year-round</option><option>Water-stressed</option><option>Unknown</option></select>
                </Field>
                <Field label="What is on the site today?" error={errors.vegetation?.message} full>
                  <textarea {...register("vegetation")} placeholder="Existing trees, weeds or invasive plants, bare soil, water flow and any known constraints." />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="raas-system-options">
                {[
                  "Site assessment and restoration plan",
                  "Miyawaki native forest",
                  "Invasive vegetation management",
                  "Native planting and establishment",
                  "Soil and erosion repair",
                  "Water-sensitive restoration",
                ].map((item) => (
                  <label className={values.objective === item ? "selected" : ""} key={item}>
                    <input type="radio" value={item} {...register("objective")} />
                    <span>{item}</span>
                    <Check aria-hidden="true" />
                  </label>
                ))}
                <div className="raas-form-grid">
                  <Field label="Timing">
                    <select {...register("timeline")}><option>Exploring options</option><option>Within 3 months</option><option>Within 6–12 months</option><option>Long-term planning</option></select>
                  </Field>
                  <Field label="Support needed">
                    <select {...register("maintenance")}><option>Prachurja-supported establishment</option><option>Assessment and design only</option><option>Implementation and maintenance</option><option>Monitoring and review</option><option>Not sure yet</option></select>
                  </Field>
                  <Field label="Preferred records">
                    <select {...register("reporting")}><option>Field records and photo monitoring</option><option>Periodic ecological report</option><option>Organisation-ready progress report</option><option>To be discussed</option></select>
                  </Field>
                  <Field label="Anything else we should know?" full>
                    <textarea {...register("message")} placeholder="Your goal for the land, important constraints or questions for the team." />
                  </Field>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="raas-review">
                <Review label="About you" value={`${values.organisation}\n${values.name} · ${values.email}`} onEdit={() => setStep(1)} />
                <Review label="About the land" value={`${values.condition}\n${values.area} ${values.unit} · ${values.district}, ${values.state}`} onEdit={() => setStep(2)} />
                <Review label="What you need" value={`${values.objective}\n${values.maintenance} · ${values.reporting}`} onEdit={() => setStep(3)} />
              </div>
            )}

            {serverError && <p className="form-error" role="alert">{serverError}</p>}
            <footer>
              {step > 1 && (
                <button type="button" className="raas-button raas-button-plain" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              {step < 4 ? (
                <button type="button" className="raas-button raas-button-primary" onClick={next}>
                  Continue
                  <ArrowRight aria-hidden="true" />
                </button>
              ) : (
                <button type="submit" className="raas-button raas-button-primary" disabled={sending}>
                  {sending ? "Submitting…" : "Submit site details"}
                  <ClipboardCheck aria-hidden="true" />
                </button>
              )}
            </footer>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  full = false,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={full ? "full" : ""}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  );
}

function Review({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <article>
      <span>{label}</span>
      <p>{value}</p>
      <button type="button" onClick={onEdit}>Edit</button>
    </article>
  );
}
