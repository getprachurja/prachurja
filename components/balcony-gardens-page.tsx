import Image from "next/image";
import { ArrowRight, Flower2, Leaf, Sprout } from "lucide-react";

const enquiryUrl = "/contact?subject=balcony-garden";

export default function BalconyGardensPage() {
  return (
    <main className="balcony-page">
      <section className="balcony-hero">
        <div className="shell balcony-hero-grid">
          <div className="balcony-hero-copy">
            <p className="eyebrow">Residential balcony gardens</p>
            <h1>A little more green, right at home.</h1>
            <p>
              Prachurja™ designs practical balcony gardens with herbs, flowers and leafy plants.
              Tell us about your space and we’ll suggest a ready-to-use design that fits your light,
              routine and budget.
            </p>
            <a className="button button-earth" href={enquiryUrl}>Plan my balcony <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <figure className="balcony-hero-image">
            <Image
              src="/balcony-garden.webp"
              alt="A modest apartment balcony with potted herbs, flowering plants and leafy greenery"
              width={1400}
              height={933}
              sizes="(max-width: 900px) 100vw, 48vw"
              priority
              unoptimized
            />
            <figcaption>Made for real homes and everyday care.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section balcony-plant-section">
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">Choose what you love</p><h2>Three ways to bring your balcony to life</h2></div></div>
          <div className="balcony-plant-grid">
            <article><Sprout aria-hidden="true" /><h3>Useful herbs</h3><p>Keep fresh, everyday herbs within reach, selected for the sunlight and space you have.</p></article>
            <article><Flower2 aria-hidden="true" /><h3>Seasonal flowers</h3><p>Add colour with flowering plants suited to your balcony’s light and local season.</p></article>
            <article><Leaf aria-hidden="true" /><h3>Leafy greenery</h3><p>Choose easy-care foliage, including plants often called “air-purifying” plants, for a calmer-feeling space.</p></article>
          </div>
          <p className="balcony-plant-note">Plants make a space feel fresher, but they are not a substitute for ventilation or an air purifier.</p>
        </div>
      </section>

      <section className="section balcony-plan-section">
        <div className="shell balcony-plan-grid">
          <div><p className="eyebrow">Simple to start</p><h2>A ready design that works for your home.</h2><p>We plan around your balcony size, sunlight, watering routine and spending range—so it is easy to enjoy, not another chore.</p></div>
          <ol>
            <li><span>01</span><div><h3>Share your space</h3><p>Tell us your city, balcony size, light conditions and what you would like to grow.</p></div></li>
            <li><span>02</span><div><h3>See a practical plan</h3><p>Get a plant and planter layout with a clear estimate before you decide.</p></div></li>
            <li><span>03</span><div><h3>Keep it growing</h3><p>Use a straightforward care guide for watering, placement and seasonal upkeep.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section balcony-cta-section">
        <div className="shell balcony-cta">
          <div><p className="eyebrow">Your balcony, your budget</p><h2>Start small. Grow beautifully.</h2><p>Ask for a budget-friendly balcony garden plan. We’ll confirm plant choices and costs for your home before any work begins.</p></div>
          <a className="button button-earth" href={enquiryUrl}>Enquire about a balcony garden <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </section>
    </main>
  );
}
