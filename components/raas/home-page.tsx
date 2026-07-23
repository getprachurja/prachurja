import Image from "next/image";
import { ArrowRight, Check, Leaf, Mountain, Trees, Waves } from "lucide-react";
import {
  activeRestorationPillars,
  restorationProcess,
} from "@/lib/raas-content";
import { Eyebrow, SectionIntro, TextLink } from "@/components/raas/shared";

export function RaasHomePage() {
  return (
    <main>
      <section className="raas-hero">
        <div className="raas-shell raas-hero-grid">
          <div className="raas-hero-copy">
            <Eyebrow>Native ecological restoration</Eyebrow>
            <h1>
              Native forests.
              <em>Living landscapes.</em>
            </h1>
            <p>
              We help degraded land recover through locally appropriate native
              planting, living-soil care and long-term stewardship.
            </p>
            <div className="raas-hero-actions">
              <a className="raas-button raas-button-primary" href="/assessment">
                Discuss a restoration site
                <ArrowRight aria-hidden="true" />
              </a>
              <a className="raas-button raas-button-secondary" href="/approach">
                See our approach
              </a>
            </div>
          </div>
          <figure className="raas-hero-visual">
            <div className="raas-hero-photo">
              <Image
                src="/hero-restoration.png"
                alt="A field ecologist measuring a young native tree at a restoration nursery"
                fill
                sizes="(max-width: 800px) 100vw, 48vw"
                priority
                unoptimized
              />
            </div>
            <figcaption>“Restoration begins by listening to the land.”</figcaption>
          </figure>
        </div>
      </section>

      <section className="raas-section raas-intro-section">
        <div className="raas-shell raas-intro-grid">
          <SectionIntro
            eyebrow="Restoration, not just planting"
            title="A site-specific path back to ecological function."
            copy="A planting day is only one moment. Recovery begins with a baseline and continues through soil care, native species selection, establishment, maintenance and evidence."
          />
          <div className="raas-simple-points">
            <article>
              <Check aria-hidden="true" />
              <div>
                <h3>Native by design</h3>
                <p>Species are chosen for the local ecosystem and the conditions of the site.</p>
              </div>
            </article>
            <article>
              <Check aria-hidden="true" />
              <div>
                <h3>Maintained through establishment</h3>
                <p>Young systems are watered, weeded, protected and corrected as they develop.</p>
              </div>
            </article>
            <article>
              <Check aria-hidden="true" />
              <div>
                <h3>Measured honestly</h3>
                <p>Survival, soil cover, canopy and field evidence are recorded against the baseline.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="raas-section raas-tinted-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="What we work on"
            title="Different landscapes need different answers."
            copy="We combine restoration and resilience measures according to the land, not a fixed package."
          />
          <div className="raas-focus-grid">
            <a href="/solutions#invasive-management">
              <Leaf aria-hidden="true" />
              <h3>Degraded and invasive-dominated land</h3>
              <p>Controlled removal, soil protection and native recovery.</p>
              <span>Learn more <ArrowRight aria-hidden="true" /></span>
            </a>
            <a href="/miyawaki">
              <Trees aria-hidden="true" />
              <h3>Compact native forests</h3>
              <p>Miyawaki-style forests for appropriate urban and institutional sites.</p>
              <span>Learn more <ArrowRight aria-hidden="true" /></span>
            </a>
            <a href="/solutions#water-retention">
              <Waves aria-hidden="true" />
              <h3>Water-sensitive landscapes</h3>
              <p>Terrain-led care for runoff, infiltration and root-zone moisture.</p>
              <span>Learn more <ArrowRight aria-hidden="true" /></span>
            </a>
            <a href="/solutions#soil-protection">
              <Mountain aria-hidden="true" />
              <h3>Fragile soil and exposed slopes</h3>
              <p>Living cover, erosion control and careful establishment.</p>
              <span>Learn more <ArrowRight aria-hidden="true" /></span>
            </a>
          </div>
        </div>
      </section>

      <section className="raas-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="How restoration moves"
            title="From baseline to a living system."
          />
          <ol className="raas-process-list">
            {restorationProcess.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
          <TextLink href="/approach">Read the full approach</TextLink>
        </div>
      </section>

      <section className="raas-section raas-miyawaki-callout">
        <div className="raas-shell raas-miyawaki-grid">
          <div>
            <Eyebrow>Miyawaki native forests</Eyebrow>
            <h2>A powerful method—when the site is right.</h2>
          </div>
          <div>
            <p>
              Miyawaki planting can create a dense, layered native forest on a compact
              site. It should follow a local reference study, careful soil preparation
              and establishment care. It is not a replacement for every ecosystem or
              every form of landscape restoration.
            </p>
            <a className="raas-button raas-button-primary" href="/miyawaki">
              Explore the Miyawaki method
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="raas-section raas-pillars-section">
        <div className="raas-shell">
          <SectionIntro
            eyebrow="The living system"
            title="Plants, soil and wildlife recover together."
          />
          <div className="raas-pillar-grid">
            {activeRestorationPillars.map((pillar, index) => (
              <article key={pillar.title}>
                <span>0{index + 1}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="raas-final-cta">
        <div className="raas-shell">
          <div>
            <Eyebrow>Start with the site</Eyebrow>
            <h2>Tell us what the land needs.</h2>
          </div>
          <div>
            <p>
              Share the location, scale and current condition. We will begin with
              suitability, constraints and the next useful field step.
            </p>
            <a className="raas-button raas-button-light" href="/assessment">
              Begin a site assessment
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
