import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="raas-blog-card">
      <div className="raas-blog-card-meta"><span>{post.category}</span><span><Clock3 aria-hidden="true" />{post.readTime}</span></div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.id}`}>Read field note <ArrowRight aria-hidden="true" /></Link>
    </article>
  );
}
