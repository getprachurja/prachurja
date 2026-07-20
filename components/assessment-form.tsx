"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, ClipboardCheck, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CART_STORAGE_KEY, cartTotal, readCart } from "@/lib/cart";

const schema = z.object({
  name: z.string().min(2, "Enter your name"), organisation: z.string().min(2, "Enter an organisation"),
  email: z.string().email("Enter a valid email"), phone: z.string().min(8, "Enter a phone number"), clientType: z.string(),
  state: z.string().min(2, "Enter a state"), district: z.string().min(2, "Enter a district"), address: z.string().min(4, "Enter a site address"),
  area: z.string().min(1, "Enter the land area"), unit: z.string(), ownership: z.string(), condition: z.string(), water: z.string(), vegetation: z.string().min(2),
  objective: z.string().min(1), timeline: z.string(), budget: z.string(), maintenance: z.string(), reporting: z.string(), message: z.string().optional(), website: z.string().optional(),
});
type Values = z.infer<typeof schema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}{error && <small className="error">{error}</small>}</label>;
}

const defaults: Values = { name:"", organisation:"", email:"", phone:"", clientType:"Corporate / CSR", state:"", district:"", address:"", area:"", unit:"hectares", ownership:"Private", condition:"Degraded scrub", water:"Seasonal", vegetation:"Sparse native and invasive mix", objective:"Forest restoration", timeline:"3–6 months", budget:"To be discussed", maintenance:"36 months", reporting:"Quarterly", message:"", website:"" };

export default function AssessmentFormPage() {
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState("");
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);
  const [cartAttached, setCartAttached] = useState(0);
  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  const values = watch();
  const steps = ["Contact", "Site", "Objective", "Requirements", "Review"];

  useEffect(() => {
    const items = readCart();
    if (!items.length) return;
    const summary = items.map(item => `${item.quantity} × ${item.name} (${item.category})`).join(", ");
    setValue("message", `Cart enquiry: ${summary}. Indicative subtotal ₹${cartTotal(items).toLocaleString("en-IN")}. Please confirm availability, suitability, delivery and final pricing.`);
    setCartAttached(items.reduce((count,item)=>count+item.quantity,0));
  }, [setValue]);

  async function next() {
    const fields: Record<number, (keyof Values)[]> = { 1:["name","organisation","email","phone"], 2:["state","district","address","area","vegetation"], 3:["objective"] };
    if (await trigger(fields[step] ?? [])) setStep(Math.min(5, step + 1));
  }

  async function submit(data: Values) {
    setSending(true); setServerError("");
    try {
      const response = await fetch("/api/assessments", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) throw new Error(payload.error ?? "Unable to submit your assessment.");
      setReference(payload.reference);
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("prachurja:cart-updated"));
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to submit your assessment.");
    } finally { setSending(false); }
  }

  if (reference) return <main className="success-page"><div className="success-card"><span className="success-icon"><Check/></span><p className="eyebrow">Assessment request confirmed</p><h1>Site information received</h1><p className="reference">Reference <b>{reference}</b></p><p>Your request is safely recorded. The Prachurja team can now review the site context and contact you using the details provided.</p><div className="next-step"><b>Expected next step</b><span>Desk review within two working days, followed by a call to confirm assessment scope and availability.</span></div><div className="button-row"><a className="button button-primary" href="/">Return home</a><a className="button button-secondary" href="/projects">Explore projects</a></div></div></main>;

  return <main><section className="page-hero"><div className="shell"><p className="eyebrow">Request a site assessment</p><h1>Start with what the land is telling us</h1><p>Share the site context, recovery objective and practical constraints. The submission is securely recorded for follow-up.</p></div></section><section className="section assessment-section"><div className="shell assessment-layout"><aside><span className="demo-label"><span/>About 5 minutes</span>{cartAttached>0&&<div className="cart-attached"><ClipboardCheck/><span><b>{cartAttached} cart {cartAttached===1?"item":"items"} attached</b>Your requested plants and products will be reviewed with this assessment.</span></div>}<ol className="step-list">{steps.map((name,index)=><li className={index+1===step?"active":index+1<step?"done":""} key={name}><span>{index+1<step?<Check/>:index+1}</span><b>{name}</b></li>)}</ol><div className="privacy-note"><FileText/><p>Your contact and site details are used only to review this enquiry. Documents can be shared securely after the first call.</p></div></aside><form onSubmit={handleSubmit(submit)}><div className="form-head"><span>Step {step} of 5</span><b>{steps[step-1]}</b></div><input className="sr-only" tabIndex={-1} autoComplete="off" {...register("website")}/>
    {step===1&&<div className="form-grid"><Field label="Name" error={errors.name?.message}><input {...register("name")} placeholder="Your full name"/></Field><Field label="Organisation" error={errors.organisation?.message}><input {...register("organisation")} placeholder="Organisation name"/></Field><Field label="Email" error={errors.email?.message}><input type="email" {...register("email")} placeholder="name@organisation.org"/></Field><Field label="Phone" error={errors.phone?.message}><input {...register("phone")} placeholder="+91"/></Field><Field label="Client type"><select {...register("clientType")}><option>Corporate / CSR</option><option>Government</option><option>Farmer / landholder</option><option>NGO / institution</option><option>Individual</option></select></Field></div>}
    {step===2&&<div className="form-grid"><Field label="State" error={errors.state?.message}><input {...register("state")} placeholder="State"/></Field><Field label="District" error={errors.district?.message}><input {...register("district")} placeholder="District"/></Field><Field label="Site address" error={errors.address?.message}><input {...register("address")} placeholder="Village / site location"/></Field><Field label="Land area" error={errors.area?.message}><input type="number" min="0" step="any" {...register("area")} placeholder="12"/></Field><Field label="Area unit"><select {...register("unit")}><option>hectares</option><option>acres</option><option>square metres</option></select></Field><Field label="Land ownership"><select {...register("ownership")}><option>Private</option><option>Government</option><option>Community</option><option>Institutional</option><option>Leasehold</option></select></Field><Field label="Current condition"><select {...register("condition")}><option>Degraded scrub</option><option>Open barren land</option><option>Invasive-dominated</option><option>Industrial / mine land</option><option>Farm landscape</option><option>Riverbank</option></select></Field><Field label="Water availability"><select {...register("water")}><option>Seasonal</option><option>Year-round</option><option>Limited</option><option>Unknown</option></select></Field><Field label="Existing vegetation" error={errors.vegetation?.message}><textarea {...register("vegetation")}/></Field></div>}
    {step===3&&<div className="objective-grid">{["Forest restoration","CSR project","Corporate green belt","Urban forest","Agroforestry","Riverbank restoration","Invasive-species removal","Soil recovery","Maintenance","Monitoring"].map((item)=><label key={item} className={values.objective===item?"selected":""}><input type="radio" value={item} {...register("objective")}/><span>{item}</span><Check/></label>)}</div>}
    {step===4&&<div className="form-grid"><Field label="Preferred timeline"><select {...register("timeline")}><option>0–3 months</option><option>3–6 months</option><option>6–12 months</option><option>Exploratory</option></select></Field><Field label="Approximate budget"><select {...register("budget")}><option>To be discussed</option><option>Below ₹10 lakh</option><option>₹10–50 lakh</option><option>₹50 lakh–₹2 crore</option><option>Above ₹2 crore</option></select></Field><Field label="Maintenance period"><select {...register("maintenance")}><option>12 months</option><option>24 months</option><option>36 months</option><option>60 months</option></select></Field><Field label="Reporting requirements"><select {...register("reporting")}><option>Quarterly</option><option>Monthly</option><option>Half-yearly</option><option>Custom / ESG aligned</option></select></Field><Field label="Additional context"><textarea {...register("message")} placeholder="Objectives, constraints, tender details or questions"/></Field></div>}
    {step===5&&<div className="review-grid">{[["Contact",`${values.name} · ${values.organisation}\n${values.email} · ${values.phone}`],["Site",`${values.address}, ${values.district}, ${values.state}\n${values.area} ${values.unit}`],["Objective",values.objective],["Requirements",`${values.timeline} · ${values.budget}\n${values.maintenance} maintenance · ${values.reporting} reporting`]].map(([label,value],index)=><div key={label}><b>{label}</b><p>{value}</p><button type="button" onClick={()=>setStep(index+1)} aria-label={`Edit ${label}`}>Edit</button></div>)}</div>}
    {serverError&&<p className="form-error" role="alert">{serverError}</p>}<div className="form-actions">{step>1&&<button className="button button-ghost" type="button" onClick={()=>setStep(step-1)}>Back</button>}{step<5?<button className="button button-primary" type="button" onClick={next}>Continue <ArrowRight/></button>:<button className="button button-earth" type="submit" disabled={sending}>{sending?"Submitting…":"Submit assessment"}<ClipboardCheck/></button>}</div>
  </form></div></section></main>;
}
