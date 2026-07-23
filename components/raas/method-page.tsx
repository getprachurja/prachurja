import { Bird, Droplets, Leaf, Wind } from "lucide-react";
import {
  activePillars,
  keystoneSpecies,
  microbialRecipe,
  pioneerSpecies,
  restorationTimeline,
} from "@/lib/raas-content";
import { ModelNote, PageHero, SectionIntro } from "@/components/raas/shared";

export function MethodPage() {
  return (
    <main>
      <PageHero
        index="02"
        eyebrow="Active forest restoration"
        title="Facilitating living ecosystems."
        copy="The strategic phase after conservation: moving from protecting remnant systems to actively rebuilding natural mechanisms, dead-soil chemistry and structural succession."
      />

      <section className="raas-section">
        <div className="raas-shell">
          <SectionIntro eyebrow="Section 01 · Beyond conservation" title="Shifting to active restoration." />
          <div className="raas-defense-grid">
            <article><span>Defense</span><h3>Conservation</h3><p>Focuses on protecting remnant pockets, establishing enforcement and halting active logging or invasive expansion.</p><blockquote>“How do we stop this ecosystem from dying?”</blockquote></article>
            <article><span>Offense</span><h3>Regeneration</h3><p>Focuses on actively rebuilding natural mechanisms, remediating dead-soil chemistry and structural replanting.</p><blockquote>“How do we actively bring this system back?”</blockquote></article>
          </div>
        </div>
      </section>

      <section className="raas-section raas-sage-section">
        <div className="raas-shell">
          <SectionIntro eyebrow="Pillars of active regeneration" title="Three biological levers." />
          <div className="raas-method-pillars">
            {activePillars.map((pillar) => <article key={pillar.number}><span>{pillar.number}</span><h3>{pillar.title}</h3><p>{pillar.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="raas-section" id="species">
        <div className="raas-shell">
          <SectionIntro eyebrow="Active succession" title="Pioneer species: soil healers." copy="Install nitrogen-fixing, deeply rooted and slope-stabilizing native species to initiate humus, aeration and structural recovery." />
          <div className="raas-species-grid">
            {pioneerSpecies.map((species, index) => <article key={species.common}><span>0{index + 1}</span><Leaf /><h3>{species.common}</h3><i>{species.botanical}</i><p>{species.role}</p></article>)}
          </div>
          <div className="raas-keystone-block">
            <div><SectionIntro eyebrow="Trophic catalysts" title="Keystone species: bird magnets." copy="Fruit-bearing keystone flora turns fauna into a distributed seed-delivery network." /></div>
            <div className="raas-keystone-list">
              {keystoneSpecies.map((species) => <article key={species.common}><Bird /><div><h3>{species.common}</h3><i>{species.botanical}</i><p>{species.role}</p></div></article>)}
              <article className="loop"><Bird /><div><h3>The Biological Loop</h3><p>Attracted birds deposit seeds from surrounding remnant forests, jumpstarting natural diversity automatically.</p></div></article>
            </div>
          </div>
        </div>
      </section>

      <section className="raas-section raas-dark-section" id="soil">
        <div className="raas-shell">
          <SectionIntro inverse eyebrow="Subterranean health" title="Soil remediation architecture." />
          <div className="raas-soil-grid">
            <article><span>01</span><h3>Biochar Carbon Sponges</h3><p>Applying raw porous biochar across freshly cleared zones binds to and neutralizes allelopathic plant toxins left behind by invasive species. It permanently holds deep hydration pockets.</p></article>
            <article><span>02</span><h3>Heavy Sheet Mulching</h3><p>Cardboard sheets and organic wood chips create a dense physical skin. This blocks light required to hatch the hidden invasive weed seed bank while feeding decomposer earthworms.</p></article>
            <article className="raas-microbe-card"><strong>10<sup>9</sup></strong><span>ACTIVE MICROBES / GRAM</span><h3>The Forest Soil Transfusion</h3><p>Borrow a handful of native soil from healthy local remnant forests and introduce it to sapling pits, re-infecting roots with critical native fungal mycelium and targeting survival rates above 90%.</p></article>
          </div>
          <ModelNote>The microbial density and survival measures are proposal targets requiring site-specific testing and validation.</ModelNote>
        </div>
      </section>

      <section className="raas-section raas-tea-section">
        <div className="raas-shell">
          <SectionIntro eyebrow="Actively aerated compost tea" title="The master microbial recipe." />
          <div className="raas-tea-principles">
            <article><Wind /><h3>High Oxygen Cultivation</h3><p>Vigorously aerating organic extracts prevents anaerobic pathogens from reproducing, breeding beneficial species instead.</p></article>
            <article><Leaf /><h3>Targeted Fungal Foods</h3><p>Liquid kelp and humic acids provide complex nourishment that encourages woody, long-term forest fungi over basic bacteria.</p></article>
            <article><Droplets /><h3>Thermal Protection</h3><p>Drenching root zones in early morning or evening prevents harsh ultraviolet solar rays from damaging the newly inoculated tea biology.</p></article>
          </div>
          <div className="raas-table-wrap">
            <table className="raas-data-table">
              <thead><tr><th>Brew component</th><th>Standard metric (20L batch)</th><th>Strategic biological goal</th></tr></thead>
              <tbody>{microbialRecipe.map((row) => <tr key={row.component}><td>{row.component}</td><td>{row.metric}</td><td>{row.goal}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="raas-section raas-sage-section">
        <div className="raas-shell">
          <SectionIntro eyebrow="Restoration success timeline" title="A phased biological reset." />
          <ol className="raas-restoration-timeline">
            {restorationTimeline.map((item, index) => <li key={item.period}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.period}</b><p>{item.copy}</p></li>)}
          </ol>
        </div>
      </section>
    </main>
  );
}
