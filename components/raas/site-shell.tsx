"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  ["/", "Overview"],
  ["/solutions", "Engineered Systems"],
  ["/method", "Active Restoration"],
  ["/economics", "Economics"],
  ["/infrastructure", "Scale Blueprint"],
] as const;

export function RaasSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="raas-site">
      <a className="raas-skip-link" href="#raas-main-content">Skip to main content</a>
      <header className="raas-header">
        <div className="raas-shell raas-header-inner">
          <a className="raas-brand" href="/" aria-label="Prachurja Restoration-as-a-Service home">
            <Image src="/prachurja-logo-final.jpeg" alt="" width={48} height={48} priority unoptimized />
            <span><b>PRACHURJA</b><small>RESTORATION-AS-A-SERVICE</small></span>
          </a>
          <nav className="raas-desktop-nav" aria-label="Primary navigation">
            {navigation.map(([href, label]) => <a className={pathname === href ? "active" : ""} href={href} key={href}>{label}</a>)}
          </nav>
          <a className="raas-header-cta" href="/assessment">Scope a project</a>
          <button className="raas-menu-button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
        </div>
      </header>
      <div className={`raas-mobile-nav${open ? " open" : ""}`} aria-hidden={!open}>
        <button aria-label="Close navigation" onClick={() => setOpen(false)}><X /></button>
        <nav aria-label="Mobile navigation">
          {navigation.map(([href, label], index) => <a href={href} key={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</a>)}
          <a className="raas-mobile-cta" href="/assessment" onClick={() => setOpen(false)}>Scope a restoration project</a>
        </nav>
      </div>
      <div id="raas-main-content">{children}</div>
      <footer className="raas-footer">
        <div className="raas-shell">
          <div className="raas-footer-lead">
            <div className="raas-footer-brand">
              <Image src="/prachurja-logo-final.jpeg" alt="" width={72} height={72} unoptimized />
              <div><b>PRACHURJA</b><span>Restoration-as-a-Service</span></div>
            </div>
            <p>Build high-integrity, data-verified biological assets through large-scale ecological engineering.</p>
            <a href="/assessment">Scale your ESG infrastructure <span>↗</span></a>
          </div>
          <div className="raas-footer-links">
            <div><b>Model</b><a href="/solutions">Engineered systems</a><a href="/economics">Per-hectare economics</a><a href="/infrastructure">Regional blueprint</a></div>
            <div><b>Restoration</b><a href="/method">Active succession</a><a href="/method#soil">Subterranean health</a><a href="/method#species">Trophic catalysts</a></div>
            <div><b>Workspace</b><a href="/portal">Secure portal</a><a href="/login">Sign in</a><a href="/assessment">Project assessment</a></div>
          </div>
          <div className="raas-footer-base"><span>© {new Date().getFullYear()} Prachurja</span><span>Facilitating living ecosystems.</span></div>
        </div>
      </footer>
    </div>
  );
}
