import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { BlogCard } from "@/components/raas/blog-card";
import type { BlogPost } from "@/lib/blog-data";

export function BlogArticlePage({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  return (
    <main>
      <article className="raas-article">
        <header className="raas-article-header">
          <div className="raas-shell">
            <Link className="raas-back-link" href="/blog"><ArrowLeft aria-hidden="true" /> Field journal</Link>
            <p className="raas-eyebrow"><span />{post.category}</p>
            <h1>{post.title}</h1>
            <div><span><Clock3 aria-hidden="true" />{post.readTime}</span><span>{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
          </div>
        </header>
        <div className="raas-shell raas-article-layout">
          <div className="raas-article-body">
            <p className="raas-article-lead">{post.excerpt}</p>
            {post.body.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside><b>Use this note well</b><p>Field notes provide orientation, not a universal prescription. Species and methods should be checked against local ecology, site condition and long-term care.</p><Link href="/assessment">Discuss your site <ArrowRight aria-hidden="true" /></Link></aside>
        </div>
      </article>
      {related.length > 0 && <section className="raas-section raas-related-notes"><div className="raas-shell"><header><p className="raas-eyebrow"><span />Continue reading</p><h2>Related field notes.</h2></header><div className="raas-blog-grid">{related.slice(0, 3).map((item) => <BlogCard post={item} key={item.id} />)}</div></div></section>}
    </main>
  );
}
