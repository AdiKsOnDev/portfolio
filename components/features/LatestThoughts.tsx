"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLatestPostsSync } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function LatestThoughts() {
  const [hoveredPost, setHoveredPost] = useState<BlogPost | null>(null);
  const [focusedPost, setFocusedPost] = useState<BlogPost | null>(null);
  const posts = getLatestPostsSync(3);
  const activePost = focusedPost || hoveredPost || posts[0];

  if (!posts.length) return null;

  return (
    <section className="bg-neutral-surface py-16 sm:py-24" aria-labelledby="latest-thoughts-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="latest-thoughts-heading" className="mb-10 font-serif text-3xl text-foreground sm:mb-14 sm:text-4xl">
          Latest Thoughts
        </h2>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                  onMouseEnter={() => setHoveredPost(post)}
                  onMouseLeave={() => setHoveredPost(null)}
                  onFocus={() => setFocusedPost(post)}
                  onBlur={() => setFocusedPost(null)}
                >
                  <h3 className="mb-3 font-serif text-2xl text-foreground underline-offset-8 group-hover:underline group-focus-visible:underline">
                    {post.title}
                  </h3>
                  <p className="mb-3 text-base leading-relaxed text-foreground">
                    {post.excerpt}
                  </p>
                  <time dateTime={post.publishedAt} className="text-sm text-foreground/75">
                    {formatDate(post.publishedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
          {activePost?.coverImage && (
            <div className="relative hidden aspect-video lg:block">
              <Image
                src={activePost.coverImage}
                alt={activePost.title}
                fill
                sizes="520px"
                className="object-contain object-top"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
