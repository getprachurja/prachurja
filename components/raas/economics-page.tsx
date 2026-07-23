import { ArrowDown, CircleDollarSign, Factory, ScanLine } from "lucide-react";
import { operatingCosts, revenueStreams } from "@/lib/raas-content";
import { ModelNote, PageHero, SectionIntro } from "@/components/raas/shared";

export function EconomicsPage() {
  return (
    <main>
      <PageHero
        index="03"
        eyebrow="Invasive-to-Asset™ economics"
        title="Multi-stream revenue generation."
        copy="The proposal combines clearing, processed biochar and carbon-removal credits on the same cleared hectare, creating an integrated target economics model."
      />
      <section className="raas-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="Target gross yield per hectare"
            title="₹2,50,000 across three value streams."
            copy="A closer look at the monetization and cost mechanics of the high-margin clearing product."
          />
          <div className="raas-econ-layout">
            <div className="raas-econ-bars">
              {revenueStreams.map((stream) => (
                <article key={stream.label}>
                  <div><h3>{stream.label}</h3><span>{stream.share}%</span></div>
                  <div className="track"><span className={stream.color} style={{ width: `${stream.share}%` }}><b>₹{stream.value.toLocaleString("en-IN")}</b></span></div>
                </article>
              ))}
              <div className="raas-econ-total"><span>Target gross yield / cleared hectare</span><strong>₹2,50,000</strong></div>
            </div>
            <aside className="raas-econ-flow">
              <div><Factory /><span>Extract the invasive biomass</span></div><ArrowDown />
              <div><CircleDollarSign /><span>Convert biomass into biochar value</span></div><ArrowDown />
              <div><ScanLine /><span>Audit the ecological and carbon record</span></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="raas-section raas-sage-section">
        <div className="raas-shell">
          <SectionIntro eyebrow="Cost structure & profit margins" title="The proposed 60% margin edge." />
          <div className="raas-margin-grid">
            <article>
              <span>Operational cost breakdown</span>
              <strong>₹1,00,000</strong>
              <small>Total target OpEx per cleared hectare</small>
              <ul>{operatingCosts.map((cost) => <li key={cost.label}><b>{cost.label}</b><span>₹{cost.value.toLocaleString("en-IN")}</span></li>)}</ul>
            </article>
            <article className="raas-margin-card">
              <span>Target net margin / hectare</span>
              <strong>₹1,50,000</strong>
              <div className="raas-margin-ring"><span>60%</span><small>margin</small></div>
              <p>The model assumes clients fund invasive-biomass extraction, creating a negative feedstock cost for processing.</p>
            </article>
          </div>
          <ModelNote>These values are strategic proposal assumptions, not guaranteed prices or returns. Live economics depend on site conditions, extraction productivity, processing yields, logistics, offtake and carbon-methodology eligibility.</ModelNote>
        </div>
      </section>

      <section className="raas-section raas-dark-section">
        <div className="raas-shell raas-econ-summary">
          <div><span>Gross revenue / ha</span><strong>₹2,50,000</strong></div>
          <div><span>Operating OpEx / ha</span><strong>₹1,00,000</strong></div>
          <div><span>Net target margin / ha</span><strong>₹1,50,000</strong></div>
          <div><span>Target margin</span><strong>60%</strong></div>
        </div>
      </section>
    </main>
  );
}
