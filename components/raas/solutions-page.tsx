import { ArrowRight, Check } from "lucide-react";
import { restorationSystems } from "@/lib/raas-content";
import { PageHero, SectionIntro } from "@/components/raas/shared";

export function SolutionsPage() {
  const restoration = restorationSystems.filter((item) => item.category === "Restoration");
  const resilience = restorationSystems.filter((item) => item.category === "Resilience");

  return (
    <main>
      <PageHero
        eyebrow="What we restore"
        title="The method follows the land."
        copy="Prachurja brings together native planting, soil and water care, invasive management and long-term stewardship. Each site receives the combination it actually needs."
      />
      <SystemGroup
        eyebrow="Ecological recovery"
        title="Restore native structure and function."
        items={restoration}
      />
      <SystemGroup
        eyebrow="Landscape resilience"
        title="Protect soil, water and vulnerable edges."
        items={resilience}
        tinted
      />
      <section className="raas-section raas-decision-section">
        <div className="raas-shell raas-decision-grid">
          <SectionIntro
            eyebrow="No fixed package"
            title="The first deliverable is a sound restoration decision."
            copy="A baseline assessment identifies what to retain, what to repair, where to intervene and which claims can be measured responsibly."
          />
          <div className="raas-decision-list">
            {[
              "Existing native vegetation is protected first",
              "Methods are matched to the original ecosystem",
              "Species selection considers provenance and site condition",
              "Maintenance and monitoring are designed before planting",
            ].map((item) => (
              <p key={item}>
                <Check aria-hidden="true" />
                {item}
              </p>
            ))}
            <a className="raas-button raas-button-primary" href="/assessment">
              Discuss your site
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SystemGroup({
  eyebrow,
  title,
  items,
  tinted = false,
}: {
  eyebrow: string;
  title: string;
  items: typeof restorationSystems;
  tinted?: boolean;
}) {
  return (
    <section className={`raas-section raas-system-group${tinted ? " tinted" : ""}`}>
      <div className="raas-shell">
        <SectionIntro eyebrow={eyebrow} title={title} />
        <div className="raas-system-list">
          {items.map((system, index) => (
            <article id={system.id} key={system.id}>
              <header>
                <span>0{index + 1}</span>
                <div>
                  <p>{system.category}</p>
                  <h2>{system.name}</h2>
                  <strong>{system.summary}</strong>
                </div>
              </header>
              <ol>
                {system.steps.map((step) => (
                  <li key={step}>
                    <Check aria-hidden="true" />
                    {step}
                  </li>
                ))}
              </ol>
              <footer>
                <span>Intended outcome</span>
                <p>{system.outcome}</p>
                {system.id === "miyawaki" && (
                  <a href="/miyawaki">
                    Read the Miyawaki guide
                    <ArrowRight aria-hidden="true" />
                  </a>
                )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
