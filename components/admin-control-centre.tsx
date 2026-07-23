"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { Check, ExternalLink, FileImage, ShieldCheck, Trash2, UploadCloud, Users } from "lucide-react";

type MediaAsset = { id: string; filename: string; url: string; altText: string; size: number };
type Member = {
  id: string;
  email: string;
  name: string;
  organisation: string;
  role: "admin" | "client" | "partner" | "field";
  status: "Active" | "Inactive";
};
type Tab = "media" | "users" | "portals";

export default function AdminControlCentre() {
  const [tab, setTab] = useState<Tab>("media");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [member, setMember] = useState({ email: "", name: "", organisation: "", role: "client" });

  async function loadAssets() {
    const response = await fetch("/api/admin/media");
    const payload = await response.json();
    if (response.ok) setAssets(payload.assets ?? []);
  }

  async function loadMembers() {
    const response = await fetch("/api/admin/members");
    const payload = await response.json();
    if (response.ok) setMembers(payload.members ?? []);
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/media").then((response) => response.json()),
      fetch("/api/admin/members").then((response) => response.json()),
    ]).then(([mediaPayload, memberPayload]) => {
      if (!active) return;
      setAssets(mediaPayload.assets ?? []);
      setMembers(memberPayload.members ?? []);
    });
    return () => { active = false; };
  }, []);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(event.currentTarget) });
    const payload = await response.json();
    if (response.ok) {
      event.currentTarget.reset();
      await loadAssets();
      setNotice("Evidence image uploaded to the media library.");
    } else setNotice(payload.error ?? "Upload failed.");
    setBusy(false);
  }

  async function removeAsset(asset: MediaAsset) {
    if (!window.confirm(`Remove ${asset.filename} from the media library?`)) return;
    setBusy(true);
    const response = await fetch(`/api/admin/media?id=${asset.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadAssets();
      setNotice("Image removed.");
    }
    setBusy(false);
  }

  async function saveMember(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const response = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    const payload = await response.json();
    if (response.ok) {
      setMember({ email: "", name: "", organisation: "", role: "client" });
      await loadMembers();
      setNotice("Workspace user saved.");
    } else setNotice(payload.error ?? "User could not be saved.");
    setBusy(false);
  }

  async function updateMember(row: Member, patch: Partial<Member>) {
    setBusy(true);
    const next = { ...row, ...patch };
    const response = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: next.id, role: next.role, status: next.status }),
    });
    if (response.ok) await loadMembers();
    setBusy(false);
  }

  return (
    <section className="admin-control-centre">
      <div className="admin-control-head">
        <div>
          <p className="eyebrow">RaaS operations control</p>
          <h2>Manage Prachurja</h2>
          <p>Control secure workspaces and restoration evidence. The public narrative is fixed to the approved RaaS proposal.</p>
        </div>
        <a className="button button-secondary" href="/" target="_blank">View public website <ExternalLink /></a>
      </div>
      <nav className="admin-tabs" aria-label="Administration sections">
        {[
          ["media", FileImage, "Evidence media"],
          ["users", Users, "Users & roles"],
          ["portals", ShieldCheck, "Portal previews"],
        ].map(([id, Icon, label]) => {
          const I = Icon as typeof FileImage;
          return <button className={tab === id ? "active" : ""} onClick={() => { setTab(id as Tab); setNotice(""); }} key={String(id)}><I />{String(label)}</button>;
        })}
      </nav>
      {notice && <div className={notice.includes("failed") || notice.includes("could not") ? "admin-notice error" : "admin-notice"}><Check />{notice}</div>}

      {tab === "media" && (
        <div className="admin-media-layout">
          <form className="admin-upload" onSubmit={upload}>
            <UploadCloud />
            <h3>Upload restoration evidence</h3>
            <p>JPG, PNG or WebP · maximum 8 MB. Add meaningful alternative text for accessibility and audit context.</p>
            <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required />
            <label><span>Alternative text</span><input name="altText" required minLength={3} placeholder="Describe the image and project context" /></label>
            <button className="button button-primary" disabled={busy}>{busy ? "Uploading…" : "Upload to library"}</button>
          </form>
          <div className="admin-media-grid">
            {assets.length === 0
              ? <div className="portal-empty"><FileImage /><p>No evidence media has been uploaded yet.</p></div>
              : assets.map((asset) => (
                <article key={asset.id}>
                  <img src={asset.url} alt={asset.altText} />
                  <div><b>{asset.filename}</b><span>{(asset.size / 1024 / 1024).toFixed(2)} MB</span><p>{asset.altText}</p><button className="danger" onClick={() => removeAsset(asset)}><Trash2 /> Remove</button></div>
                </article>
              ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-users-layout">
          <form className="admin-user-form" onSubmit={saveMember}>
            <p className="eyebrow">Direct access</p><h3>Add a workspace user</h3>
            <p>Assign each person to a role-specific, authenticated operational workspace.</p>
            <label><span>Email</span><input type="email" required value={member.email} onChange={(event) => setMember({ ...member, email: event.target.value })} /></label>
            <label><span>Name</span><input required minLength={2} value={member.name} onChange={(event) => setMember({ ...member, name: event.target.value })} /></label>
            <label><span>Organisation</span><input required minLength={2} value={member.organisation} onChange={(event) => setMember({ ...member, organisation: event.target.value })} /></label>
            <label><span>Workspace</span><select value={member.role} onChange={(event) => setMember({ ...member, role: event.target.value })}><option value="client">Client portal</option><option value="partner">Partner portal</option><option value="field">Field portal</option><option value="admin">Administrator</option></select></label>
            <button className="button button-primary" disabled={busy}>Save workspace user</button>
          </form>
          <div className="admin-member-list">
            <div><p className="eyebrow">Access directory</p><h3>Users and roles</h3></div>
            {members.length === 0
              ? <div className="portal-empty"><Users /><p>No database-managed users yet. Environment administrators remain active.</p></div>
              : members.map((row) => (
                <article key={row.id}>
                  <div><b>{row.name}</b><span>{row.email}</span><small>{row.organisation}</small></div>
                  <select value={row.role} disabled={busy} onChange={(event) => updateMember(row, { role: event.target.value as Member["role"] })}><option value="admin">Admin</option><option value="client">Client</option><option value="partner">Partner</option><option value="field">Field</option></select>
                  <button className={row.status === "Active" ? "status-active" : ""} disabled={busy} onClick={() => updateMember(row, { status: row.status === "Active" ? "Inactive" : "Active" })}>{row.status}</button>
                </article>
              ))}
          </div>
        </div>
      )}

      {tab === "portals" && (
        <div className="admin-portal-grid">
          {[
            ["Client portal", "Enterprise assessments, reports and verified project actions.", "/client"],
            ["Partner portal", "Regional supply capacity, inventory batches and approvals.", "/partner-portal"],
            ["Field portal", "Field assignments, quantities, maintenance and issues.", "/field"],
            ["Public RaaS website", "Proposal-aligned customer experience and project scoping.", "/"],
          ].map(([title, copy, href]) => <a href={href} key={href} target="_blank"><ShieldCheck /><span><b>{title}</b><p>{copy}</p></span><ExternalLink /></a>)}
        </div>
      )}
    </section>
  );
}
