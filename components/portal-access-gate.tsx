"use client";

import { useState } from "react";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import type { PortalRole } from "@/lib/portal-auth";

const destination: Record<PortalRole, string> = {
  admin: "/admin",
  client: "/client",
  partner: "/partner-portal",
  field: "/field",
};

export default function PortalAccessGate({
  user,
  assignedRole,
}: {
  user: { name: string; email: string };
  assignedRole?: PortalRole | null;
}) {
  const [organisation, setOrganisation] = useState("");
  const [requestedRole, setRequestedRole] = useState<"client" | "partner" | "field">("client");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setError("");
    const response = await fetch("/api/portal/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organisation, requestedRole, message }),
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to send the request.");
      setState("error");
      return;
    }
    setState("sent");
  }

  if (assignedRole) {
    return <main className="portal-gate"><section className="portal-gate-card"><div className="portal-lock"><LockKeyhole /></div><p className="eyebrow">Secure Prachurja portal</p><h1>You are signed in</h1><p>Your account is assigned to the <b>{assignedRole}</b> workspace. Use the button below to continue.</p><a className="button button-primary" href={destination[assignedRole]}>Open my workspace <ArrowRight /></a><a className="portal-signout" href="/signout-with-chatgpt?return_to=/">Sign out</a></section></main>;
  }

  return <main className="portal-gate"><section className="portal-gate-card wide"><div className="portal-lock"><LockKeyhole /></div><p className="eyebrow">Secure Prachurja portal</p><h1>Request workspace access</h1><p>Signed in as <b>{user.name}</b><br/><span>{user.email}</span></p>{state === "sent" ? <div className="portal-request-success"><Check/><div><h2>Request received</h2><p>An administrator will verify your organisation and assign the correct workspace. You can safely close this page.</p></div></div> : <form onSubmit={submit} className="portal-request-form"><label><span>Organisation</span><input required minLength={2} value={organisation} onChange={(event)=>setOrganisation(event.target.value)} placeholder="Organisation or group"/></label><label><span>Workspace needed</span><select value={requestedRole} onChange={(event)=>setRequestedRole(event.target.value as typeof requestedRole)}><option value="client">Client dashboard</option><option value="partner">Partner portal</option><option value="field">Field workspace</option></select></label><label className="full"><span>Context for the administrator</span><textarea value={message} onChange={(event)=>setMessage(event.target.value)} placeholder="Project, responsibilities or existing Prachurja contact"/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Request access"}<ArrowRight/></button></form>}<div className="portal-gate-links"><a href="/">Return to website</a><a href="/signout-with-chatgpt?return_to=/">Sign out</a></div></section></main>;
}
