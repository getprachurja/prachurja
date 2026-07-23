import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="raas-eyebrow"><span />{children}</p>;
}

export function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <header className="raas-section-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </header>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="raas-text-link" href={href}>
      {children}
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <section className="raas-page-hero">
      <div className="raas-shell">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}
