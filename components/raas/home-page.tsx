import { ArrowDownRight, ArrowRight, Gauge, Orbit, ScanLine, Sprout } from "lucide-react";
import { activePillars, restorationProducts, revenueStreams } from "@/lib/raas-content";
import { Eyebrow, ModelNote, SectionIntro, TextLink } from "@/components/raas/shared";

export function RaasHomePage() {
  return (
    <main>
      <section className="raas-hero">
        <div className="raas-hero-grid raas-shell">
          <div className="raas-hero-copy">
            <Eyebrow light>Restoration-as-a-Service · India</Eyebrow>
            <h1>Restoration-<br />as-a-<em>Service.</em></h1>
            <p className="raas-hero-lede">A ₹100 Crore business model for large-scale forest restoration and conservation infrastructure.</p>
            <p>Transitioning natural liabilities into high-integrity corporate ESG assets through measurable ecological engineering.</p>
            <div className="raas-hero-actions">
              <a className="raas-button raas-button-mint" href="/assessment">Scope a restoration project <ArrowRight /></a>
              <a className="raas-button raas-button-ghost" href="/solutions">Explore engineered systems</a>
            </div>
          </div>
          <div className="raas-asset-visual" aria-label="Restoration asset system showing ecology, engineering and MRV">
            <div className="raas-orbit orbit-one" />
            <div className="raas-orbit orbit-two" />
            <div className="raas-orbit orbit-three" />
            <div className="raas-asset-core"><Sprout /><b>LIVING ASSET</b><span>Restoration · verified over time</span></div>
            <div className="raas-float-card card-a"><ScanLine /><span><b>Continuous MRV</b>Satellite · LiDAR · drone</span></div>
            <div className="raas-float-card card-b"><Orbit /><span><b>Stacked value</b>Clearing · biochar · carbon</span></div>
            <div className="raas-float-card card-c"><Gauge /><span><b>Regional capacity</b>1,000 hectares / year</span></div>
          </div>
        </div>
        <div className="raas-shell raas-hero-metrics">
          <div><strong>₹100 CR</strong><span>Strategic run-rate ambition</span></div>
          <div><strong>06</strong><span>Engineered restoration systems</span></div>
          <div><strong>1,000 HA</strong><span>Regional annual capacity</span></div>
          <div><strong>24+</strong><span>Months to registry-scale MRV</span></div>
        </div>
      </section>

      <section className="raas-section raas-model-section">
        <div className="raas-shell raas-model-grid">
          <SectionIntro
            eyebrow="The B2B RaaS business model"
            title="Measurable ecological outcomes."
            copy="Instead of selling unmonitored plantations, Prachurja structures standardized, risk-managed forestry engineering solutions for corporate ESG and compliance markets."
          />
          <div className="raas-principle-list">
            <article><span>01</span><div><h3>Regulatory Alignment</h3><p>Meets compensatory afforestation and land-reclamation mandates.</p></div></article>
            <article><span>02</span><div><h3>Continuous Tracking</h3><p>Direct integration with digital audit-ready satellite and LiDAR telemetry.</p></div></article>
            <article><span>03</span><div><h3>High-Margin Scale</h3><p>Stacked monetization streams on the exact same land assets.</p></div></article>
          </div>
        </div>
      </section>

      <section className="raas-section raas-dark-section">
        <div className="raas-shell">
          <SectionIntro
            inverse
            eyebrow="Core product architecture"
            title="Six systems. One restoration asset."
            copy="Three active-restoration products rebuild ecological function. Three conservation products secure water, soil and fire resilience."
          />
          <div className="raas-product-preview">
            {restorationProducts.map((product, index) => (
              <a href={`/solutions#${product.id}`} key={product.id}>
                <div><span>{String(index + 1).padStart(2, "0")}</span><b>{product.category}</b></div>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <ArrowDownRight />
              </a>
            ))}
          </div>
          <TextLink href="/solutions" tone="light">See the complete product systems</TextLink>
        </div>
      </section>

      <section className="raas-section raas-method-teaser">
        <div className="raas-shell">
          <div className="raas-method-heading">
            <SectionIntro
              eyebrow="Active forest restoration"
              title="Beyond conservation."
              copy="Stopping the damage is only the first step. Active regeneration rebuilds natural mechanisms, remediates dead-soil chemistry and restores structural planting."
            />
            <blockquote>“How do we actively bring this system back?”</blockquote>
          </div>
          <div className="raas-pillar-grid">
            {activePillars.map((pillar) => (
              <article key={pillar.number}>
                <span>{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
          <TextLink href="/method">Enter the active restoration playbook</TextLink>
        </div>
      </section>

      <section className="raas-section raas-economics-teaser">
        <div className="raas-shell raas-economics-grid">
          <div>
            <SectionIntro
              eyebrow="Invasive-to-Asset™ economics"
              title="Three revenue streams. One cleared hectare."
              copy="The proposal pools B2B clearing, biochar product sales and carbon-removal credits into a target gross yield of ₹2,50,000 per hectare."
            />
            <ModelNote>Financial figures are proposal assumptions and require project-level validation, contracting and registry eligibility.</ModelNote>
            <TextLink href="/economics">Review the complete unit economics</TextLink>
          </div>
          <div className="raas-revenue-bars">
            {revenueStreams.map((stream) => (
              <div key={stream.label}>
                <div><b>{stream.label}</b><span>₹{stream.value.toLocaleString("en-IN")} · {stream.share}%</span></div>
                <i><span className={stream.color} style={{ width: `${stream.share}%` }} /></i>
              </div>
            ))}
            <div className="raas-yield-total"><span>Target gross yield / hectare</span><strong>₹2,50,000</strong></div>
          </div>
        </div>
      </section>

      <section className="raas-final-cta">
        <div className="raas-shell">
          <Eyebrow light>Scale your ESG infrastructure</Eyebrow>
          <h2>Build high-integrity, data-verified biological assets.</h2>
          <p>Begin with the land condition, mandate, target product system and verification requirement.</p>
          <a className="raas-button raas-button-mint" href="/assessment">Start project scoping <ArrowRight /></a>
        </div>
      </section>
    </main>
  );
}
