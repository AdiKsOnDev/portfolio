"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types";

interface ContinueReadingProps {
  posts: BlogPost[];
  currentSlug?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ContinueReading({ posts, currentSlug }: ContinueReadingProps) {
  // Deterministic first pick for SSR / hydration; randomised on the client.
  const [pick, setPick] = useState<BlogPost | null>(() => {
    const others = posts.filter((p) => p.slug !== currentSlug);
    return others[0] ?? null;
  });

  useEffect(() => {
    const others = posts.filter((p) => p.slug !== currentSlug);
    if (others.length <= 1) return;
    const id = window.setTimeout(
      () => setPick(others[Math.floor(Math.random() * others.length)]),
      0
    );
    return () => window.clearTimeout(id);
  }, [posts, currentSlug]);

  if (!pick) return null;

  return (
    <section className="mt-16 border-t border-muted-border pt-12 text-center sm:text-left">
      <h2 className="mb-8 text-xs uppercase tracking-wider text-accent">
        Continue Reading
      </h2>

      <Link
        href={`/blog/${pick.slug}`}
        className="group grid grid-cols-1 gap-6 sm:grid-cols-[300px_1fr] sm:items-center"
      >
        <div className="aspect-video overflow-hidden border border-muted-border bg-muted">
          {pick.coverImage ? (
            <img
              src={pick.coverImage}
              alt={pick.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-secondary">
                {pick.category}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 text-sm text-secondary">
            {pick.category} · {formatDate(pick.publishedAt)}
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground transition-colors group-hover:text-accent">
            {pick.title}
          </h3>
          <p className="mt-3 leading-relaxed text-secondary line-clamp-2">
            {pick.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-accent">
            Read Article
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </section>
  );
}
