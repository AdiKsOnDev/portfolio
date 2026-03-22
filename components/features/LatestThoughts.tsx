"use client";

import { useState } from "react";
import Link from "next/link";
import { getLatestPostsSync } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function LatestThoughts() {
  const [hoveredPost, setHoveredPost] = useState<BlogPost | null>(null);
  const posts = getLatestPostsSync(2);
  const activePost = hoveredPost || posts[0];

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-1 flex lg:flex-col items-center lg:items-start gap-4">
            <span className="text-xs uppercase tracking-wider text-accent font-sans lg:writing-mode-vertical [writing-mode:vertical-rl] rotate-180">
              Latest Thoughts
            </span>
            <div className="hidden lg:block w-px h-8 bg-muted-border lg:order-first" />
          </div>

          <div className="lg:col-span-6 space-y-8">
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

          <div className="lg:col-span-4 lg:col-start-9 hidden lg:block">
            <div className="sticky top-24 aspect-[4/3] w-70 ml-auto relative overflow-hidden bg-card border border-muted-border">
              {posts.map((post) => (
                <img
                  key={post.slug}
                  src={post.coverImage}
                  alt={post.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                    post === activePost ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
