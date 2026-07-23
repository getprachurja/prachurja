import { ArrowRight, Check, X } from "lucide-react";
import { miyawakiLayers, miyawakiStages } from "@/lib/raas-content";
import { PageHero, SectionIntro } from "@/components/raas/shared";

export function MiyawakiPage() {
  return (
    <main>
      <PageHero
        eyebrow="Miyawaki native forests"
        title="A compact forest, designed from local ecology."
        copy="The Miyawaki method uses close planting, a diverse native species mix and prepared soil to establish a layered forest on a small site. Prachurja uses it only after checking ecological and practical suitability."
      />

      <section className="raas-section">
        <div className="raas-shell raas-fit-grid">
          <div>
            <SectionIntro
              eyebrow="Where it can fit"
              title="Useful for land-constrained sites."
            />
            <div className="raas-fit-list positive">
              {[
                "Urban and peri-urban plots with a clear native-forest objective",
                "Institutional, campus and industrial buffer sites",
                "Compact sites where long-term access and establishment care are possible",
                "Places where a local forest reference can guide the species community",
              ].map((item) => (
                <p key={item}><Check aria-hidden="true" />{item}</p>
              ))}
            </div>
          </div>
          <div>
            <SectionIntro
              eyebrow="Where it may not fit"
              title="Not every open space should become a dense forest."
            />
            <div className="raas-fit-list negative">
              {[
                "Natural grasslands, wetlands or other non-forest ecosystems",
                "Sites without a suitable water and maintenance plan",
                "Large landscapes that need assisted natural regeneration instead",
                "Projects seeking a quick visual plantation without ecological study",
              ].map((item) => (
                <p key={item}><X aria-hidden="true" />{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="raas-section raas-tinted-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="Forest structure"
            title="Diversity across four vegetation layers."
            copy="The final mix comes from the local reference ecosystem—not a universal catalogue of fast-growing trees."
          />
          <div className="raas-layer-grid">
            {miyawakiLayers.map((layer, index) => (
              <article key={layer.title}>
                <span>0{index + 1}</span>
                <h3>{layer.title}</h3>
                <p>{layer.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="raas-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="From study to stewardship"
            title="Five stages of a responsible Miyawaki project."
          />
          <ol className="raas-miyawaki-stages">
            {miyawakiStages.map((stage) => (
              <li key={stage.number}>
                <span>{stage.number}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="raas-section raas-miyawaki-note">
        <div className="raas-shell raas-miyawaki-grid">
          <div>
            <p>Our principle</p>
            <h2>The method should serve the ecosystem—not become the objective.</h2>
          </div>
          <div>
            <p>
              If a compact native forest is suitable, we can design one. If natural
              regeneration, open-habitat restoration or another approach is better,
              the assessment should say so.
            </p>
            <a className="raas-button raas-button-primary" href="/assessment?system=miyawaki">
              Check your site’s suitability
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
