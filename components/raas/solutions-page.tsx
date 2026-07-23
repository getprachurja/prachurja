import { ArrowRight, CheckCircle2 } from "lucide-react";
import { restorationProducts } from "@/lib/raas-content";
import { Eyebrow, PageHero, SectionIntro } from "@/components/raas/shared";

export function SolutionsPage() {
  const restoration = restorationProducts.filter((item) => item.category === "Restoration");
  const conservation = restorationProducts.filter((item) => item.category === "Conservation");

  return (
    <main>
      <PageHero
        index="01"
        eyebrow="Core forest products"
        title="Engineered restoration systems."
        copy="A connected product architecture spanning invasive-biomass conversion, local genetic fidelity, high-density native establishment, water retention, soil protection and living fire resilience."
      />
      <ProductGroup title="Core Forest Restoration Products" eyebrow="Rebuild ecological function" items={restoration} />
      <ProductGroup title="Core Forest Conservation Products" eyebrow="Secure the living asset" items={conservation} tone="sage" />
      <section className="raas-section raas-systems-flow">
        <div className="raas-shell">
          <SectionIntro eyebrow="Integrated delivery" title="From liability to verified asset." />
          <ol>
            {["Map the natural liability", "Select the engineered system", "Deploy regional field capacity", "Track the ecological response", "Audit the outcome and asset value"].map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b>{index < 4 && <ArrowRight />}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

function ProductGroup({
  title,
  eyebrow,
  items,
  tone = "cream",
}: {
  title: string;
  eyebrow: string;
  items: typeof restorationProducts;
  tone?: "cream" | "sage";
}) {
  return (
    <section className={`raas-section raas-product-group ${tone}`} id={items[0]?.category.toLowerCase()}>
      <div className="raas-shell">
        <SectionIntro eyebrow={eyebrow} title={title} />
        <div className="raas-detailed-products">
          {items.map((product, index) => (
            <article id={product.id} key={product.id}>
              <div className="raas-product-marker"><span>{product.marker}</span><small>0{index + 1}</small></div>
              <div className="raas-product-copy">
                <Eyebrow>{product.category} system</Eyebrow>
                <h2>{product.name}</h2>
                <p className="lead">{product.summary}</p>
                <ul>{product.mechanism.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul>
              </div>
              <aside><span>System outcome</span><p>{product.outcome}</p><a href={`/assessment?system=${product.id}`}>Scope this system <ArrowRight /></a></aside>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
