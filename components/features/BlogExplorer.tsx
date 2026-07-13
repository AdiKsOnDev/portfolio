"use client";

import { useState } from "react";
import { Rss, Check } from "lucide-react";
import { ArticleList } from "./ArticleList";
import type { BlogPost } from "@/types";

interface BlogExplorerProps {
  posts: BlogPost[];
  categories: { name: string; count: number }[];
  rssUrl: string;
}

/**
 * Client container for the blog listing: a filterable topic bar (+ RSS button)
 * above a category-filtered article grid.
 */
export function BlogExplorer({ posts, categories, rssUrl }: BlogExplorerProps) {
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const full = rssUrl.startsWith("http")
        ? rssUrl
        : `${window.location.origin}${rssUrl}`;
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  const chip = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 border px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
      isActive
        ? "border-accent text-accent"
        : "border-muted-border text-secondary hover:border-accent/50 hover:text-foreground"
    }`;

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex flex-col gap-5 border-y border-muted-border py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setActive(null)} className={chip(active === null)}>
              All
            </button>
            {categories.map((category) => {
              const isActive = active === category.name;
              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setActive(isActive ? null : category.name)}
                  className={chip(isActive)}
                >
                  {category.name}
                  <span className={isActive ? "text-accent/60" : "text-secondary/50"}>
                    {category.count.toString().padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex flex-shrink-0 items-center gap-2 self-start border border-muted-border px-4 py-2 text-xs uppercase tracking-wider text-secondary transition-colors hover:border-accent/50 hover:text-foreground md:self-auto"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <Rss className="h-4 w-4 text-accent" />
            )}
            {copied ? "Feed URL copied" : "Subscribe via RSS"}
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {filtered.length > 0 ? (
          <ArticleList posts={filtered} />
        ) : (
          <p className="text-sm text-secondary">No posts in this topic yet.</p>
        )}
      </section>
    </>
  );
}
