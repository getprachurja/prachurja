import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`raas-eyebrow${light ? " raas-eyebrow-light" : ""}`}><span />{children}</p>;
}

export function SectionIntro({
  eyebrow,
  title,
  copy,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  inverse?: boolean;
}) {
  return (
    <header className={`raas-section-intro${inverse ? " inverse" : ""}`}>
      <Eyebrow light={inverse}>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </header>
  );
}

export function TextLink({ href, children, tone = "dark" }: { href: string; children: ReactNode; tone?: "dark" | "light" }) {
  return <a className={`raas-text-link ${tone}`} href={href}>{children}<ArrowUpRight /></a>;
}

export function ModelNote({ children }: { children: ReactNode }) {
  return <p className="raas-model-note"><b>Strategic model:</b> {children}</p>;
}

export function PageHero({ eyebrow, title, copy, index }: { eyebrow: string; title: string; copy: string; index: string }) {
  return (
    <section className="raas-page-hero">
      <div className="raas-shell raas-page-hero-grid">
        <div>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{copy}</p>
        </div>
        <div className="raas-page-index" aria-hidden="true">{index}</div>
      </div>
    </section>
  );
}
