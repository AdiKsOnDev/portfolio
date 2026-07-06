"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui";
import type { BlogPost } from "@/types";

interface ArticleListProps {
  posts: BlogPost[];
}

export function ArticleList({ posts }: ArticleListProps) {
  return (
    <div>
      <FadeIn>
        <span className="text-xs uppercase tracking-wider text-accent font-sans block mb-8">
          Latest Writing
        </span>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 100} className="h-full">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full bg-card border border-muted-border overflow-hidden hover:border-accent/50 transition-all duration-300"
            >
              {post.coverImage ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-secondary text-xs uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              )}

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs uppercase tracking-wider text-accent">
                    {post.category}
                  </span>
                  <span className="text-xs text-secondary">·</span>
                  <span className="text-xs text-secondary">{post.readTime}</span>
                </div>
                <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted-border">
                  <span className="text-xs text-secondary">
                    {formatDate(post.publishedAt)}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-accent transition-colors" />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
