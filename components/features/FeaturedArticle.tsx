import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";

interface FeaturedArticleProps {
  post: BlogPost;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <section className="py-16 border-b border-muted-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-video bg-muted border border-muted-border overflow-hidden">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs uppercase tracking-wider text-accent">
                Featured Archive
              </span>
            </div>
            <span className="text-xs uppercase tracking-wider text-secondary mb-2">
              {post.category} · {post.readTime}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
              {post.title}
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-accent text-sm font-sans uppercase tracking-wider hover:underline"
            >
              Read Transcript
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
