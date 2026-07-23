import { ArrowRight, MapPinned, RadioTower, Truck } from "lucide-react";
import { infrastructureRows, scaleRoadmap } from "@/lib/raas-content";
import { ModelNote, PageHero, SectionIntro } from "@/components/raas/shared";

export function InfrastructurePage() {
  return (
    <main>
      <PageHero
        index="04"
        eyebrow="Industrial capacity & CapEx"
        title="A regional restoration blueprint."
        copy="The operational blueprint and investment budget required to deploy one regional module with mobile processing, a central finishing yard, field labor, logistics and MRV."
      />
      <section className="raas-section">
        <div className="raas-shell">
          <SectionIntro eyebrow="CapEx & OpEx regional blueprint" title="One module. 1,000 hectares per year." />
          <div className="raas-infra-icons">
            <article><Truck /><b>Mobile spoke fleet</b><span>Field extraction and processing</span></article>
            <article><MapPinned /><b>Central biochar yard</b><span>Finishing, enrichment and packing</span></article>
            <article><RadioTower /><b>MRV systems</b><span>Mapping drones and audits</span></article>
          </div>
          <div className="raas-table-wrap">
            <table className="raas-data-table raas-infra-table">
              <thead><tr><th>Budget item</th><th>Capital cost (CapEx)</th><th>Monthly operational (OpEx)</th><th>Capacity / details</th></tr></thead>
              <tbody>
                {infrastructureRows.map((row) => <tr key={row.item}><td><b>{row.item}</b></td><td>{row.capex}</td><td>{row.opex}</td><td>{row.details}</td></tr>)}
                <tr className="total"><td><b>Totals</b></td><td><b>₹1,35,00,000</b></td><td><b>₹10,71,000 / mo</b></td><td><b>Clears 1,000 hectares / year</b></td></tr>
              </tbody>
            </table>
          </div>
          <ModelNote>Regional capacity, costs and equipment are proposal targets and require vendor quotations, statutory review and operating validation.</ModelNote>
        </div>
      </section>

      <section className="raas-section raas-dark-section">
        <div className="raas-shell">
          <SectionIntro inverse eyebrow="Enterprise scaling roadmap" title="From mapping layer to ₹100 CR run-rate." />
          <ol className="raas-scale-roadmap">
            {scaleRoadmap.map((item, index) => (
              <li key={item.period}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
                <b>{item.period}</b>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="raas-final-cta">
        <div className="raas-shell">
          <p className="raas-eyebrow raas-eyebrow-light"><span />Scale your ESG infrastructure</p>
          <h2>Partner to build high-integrity biological assets.</h2>
          <p>Start with a regional site, natural liability, enterprise mandate and verification requirement.</p>
          <a className="raas-button raas-button-mint" href="/assessment">Scope a regional module <ArrowRight /></a>
        </div>
      </section>
    </main>
  );
}
