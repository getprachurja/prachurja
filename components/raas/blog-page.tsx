import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogCard } from "@/components/raas/blog-card";
import { Eyebrow } from "@/components/raas/shared";
import type { BlogPost } from "@/lib/blog-data";

export function BlogPage({ posts }: { posts: BlogPost[] }) {
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const remaining = posts.filter((post) => post.id !== featured?.id);
  return (
    <main>
      <section className="raas-blog-hero">
        <div className="raas-shell">
          <Eyebrow>Field journal</Eyebrow>
          <h1>Notes for restoring living landscapes.</h1>
          <p>Practical writing on native species, soil, stewardship, habitat and evidence from the field.</p>
        </div>
      </section>
      {featured && (
        <section className="raas-section raas-featured-note">
          <div className="raas-shell raas-featured-note-grid">
            <figure><Image src={featured.coverImageUrl} alt="Native vegetation in a recovering landscape" fill sizes="(max-width: 780px) 100vw, 48vw" unoptimized /></figure>
            <div>
              <span className="raas-blog-category"><BookOpen aria-hidden="true" />{featured.category} · {featured.readTime}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link className="raas-button raas-button-primary" href={`/blog/${featured.id}`}>Read the field note <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      )}
      <section className="raas-section raas-blog-index">
        <div className="raas-shell">
          <header className="raas-blog-index-head"><div><Eyebrow>Browse the journal</Eyebrow><h2>Ecology, explained clearly.</h2></div><p>Use these notes as orientation. Site decisions still require local observation and appropriate technical review.</p></header>
          <div className="raas-blog-grid">{remaining.map((post) => <BlogCard post={post} key={post.id} />)}</div>
        </div>
      </section>
    </main>
  );
}
