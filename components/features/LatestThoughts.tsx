"use client";

import { useState } from "react";
import Link from "next/link";
import { getLatestPostsSync } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui";
import type { BlogPost } from "@/types";

export function LatestThoughts() {
  const [hoveredPost, setHoveredPost] = useState<BlogPost | null>(null);
  const posts = getLatestPostsSync(2);
  const activePost = hoveredPost || posts[0];

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <span className="text-xs uppercase tracking-wider text-accent font-sans block mb-8">
            Latest Thoughts
          </span>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeIn delay={100}>
            <div className="space-y-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                  onMouseEnter={() => setHoveredPost(post)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-secondary text-sm italic mb-2">
                    {post.excerpt}
                  </p>
                  <span className="text-xs text-secondary">
                    {formatDate(post.publishedAt)}
                  </span>
                </Link>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="bg-card border border-muted-border overflow-hidden transition-all duration-300">
              <div className="aspect-square relative">
                {posts.map((post) => (
                  <img
                    key={post.slug}
                    src={post.coverImage}
                    alt={post.title}
                    className={"absolute inset-0 object-cover transition-opacity duration-200 " + (post === activePost ? "opacity-100" : "opacity-0")}
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
