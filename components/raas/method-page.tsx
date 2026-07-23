import { Check, Leaf, ScanSearch, Sprout } from "lucide-react";
import {
  activeRestorationPillars,
  exampleSpecies,
  monitoringMeasures,
  restorationProcess,
} from "@/lib/raas-content";
import { PageHero, SectionIntro } from "@/components/raas/shared";

export function MethodPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our approach"
        title="Protect what remains. Restore what can recover."
        copy="Conservation stops further loss. Active restoration then helps soil, native vegetation and ecological relationships return through a site-specific sequence of work."
      />

      <section className="raas-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="A complete restoration cycle"
            title="Planting is the middle, not the beginning."
          />
          <ol className="raas-process-list raas-process-detailed">
            {restorationProcess.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="raas-section raas-tinted-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="Active restoration"
            title="Three parts of one living system."
          />
          <div className="raas-pillar-grid">
            {activeRestorationPillars.map((pillar, index) => (
              <article key={pillar.title}>
                {index === 0 && <Sprout aria-hidden="true" />}
                {index === 1 && <Leaf aria-hidden="true" />}
                {index === 2 && <ScanSearch aria-hidden="true" />}
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="raas-section" id="soil">
        <div className="raas-shell raas-soil-layout">
          <SectionIntro
            eyebrow="Living soil"
            title="Create the conditions for roots and recovery."
            copy="Soil treatment starts with diagnosis. The response may include decompaction, surface protection, mulch, suitable organic amendments and careful water management."
          />
          <div>
            <article>
              <span>01</span>
              <h3>Protect structure</h3>
              <p>Avoid unnecessary disturbance and keep exposed soil covered during establishment.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Support biology</h3>
              <p>Use locally appropriate organic inputs only when the site assessment shows they are useful.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Manage moisture</h3>
              <p>Mulch and terrain-sensitive water management help the root zone through seasonal stress.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="raas-section raas-species-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="Native species"
            title="A reference list begins a conversation—it never replaces field ecology."
            copy="The proposal identifies useful pioneer and wildlife-supporting species. Their inclusion depends on natural range, local provenance, site conditions and the target ecosystem."
          />
          <div className="raas-species-list">
            {exampleSpecies.map((species) => (
              <article key={species.common}>
                <h3>{species.common}</h3>
                <i>{species.botanical}</i>
                <p>{species.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="raas-section" id="monitoring">
        <div className="raas-shell raas-monitoring-grid">
          <SectionIntro
            eyebrow="Monitoring"
            title="Evidence that stays connected to the field."
            copy="Every project should define its baseline, observation method and review schedule before making claims about recovery."
          />
          <div className="raas-monitoring-list">
            {monitoringMeasures.map((measure) => (
              <p key={measure}>
                <Check aria-hidden="true" />
                {measure}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
