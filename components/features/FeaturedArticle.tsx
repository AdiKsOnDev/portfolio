import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui";
import type { BlogPost } from "@/types";

interface FeaturedArticleProps {
  post: BlogPost;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-12">
      <FadeIn>
        <Link
          href={`/blog/${post.slug}`}
          className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
        >
          <div className="aspect-video overflow-hidden border border-muted-border bg-muted">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs uppercase tracking-wider text-secondary">
                  {post.category}
                </span>
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <div className="mb-3 text-sm text-secondary">
              {post.category} · {formatDate(post.publishedAt)}
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent lg:text-4xl">
              {post.title}
            </h2>
            <p className="mt-4 leading-relaxed text-secondary line-clamp-3">
              {post.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-accent">
              Read Article
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      </FadeIn>
    </section>
  );
}
