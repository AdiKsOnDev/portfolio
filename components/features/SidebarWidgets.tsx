"use client";

import { useState } from "react";
import { Copy, Check, Rss } from "lucide-react";
import type { GitHubCommit } from "@/types";

export function CopyButton({ rssUrl }: { rssUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const fullUrl = rssUrl.startsWith("http")
        ? rssUrl
        : `${window.location.origin}${rssUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-card border border-muted-border p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Rss className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-wider text-accent">
          RSS Feed
        </span>
      </div>
      <p className="font-serif italic text-secondary text-sm mb-4">
        Subscribe to updates via RSS feed.
      </p>
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm tracking-wider hover:opacity-90 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Feed URL
          </>
        )}
      </button>
    </div>
  );
}

export function TaxonomyWidget({ categories }: { categories: { name: string; count: number }[] }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs uppercase tracking-wider text-secondary mb-4">
        Taxonomy
      </h4>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name} className="flex justify-between items-center">
            <span className="text-sm text-foreground hover:text-accent cursor-pointer">
              {category.name}
            </span>
            <span className="text-xs text-secondary">{category.count.toString().padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LatestCommitsWidget({ commits }: { commits: GitHubCommit[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-secondary mb-4">
        Latest Commits
      </h4>
      <ul className="space-y-3">
        {commits.map((commit, i) => (
          <li key={i} className="flex items-start gap-3">
            <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <line x1="1.05" y1="12" x2="7" y2="12" />
              <line x1="17.01" y1="12" x2="22.96" y2="12" />
            </svg>
            <div>
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:text-accent transition-colors hover:underline"
              >
                {commit.message}
              </a>
              <p className="text-xs text-secondary">
                on {commit.branch} · {commit.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SidebarWidgets({ commits, categories, rssUrl }: { commits: GitHubCommit[]; categories: { name: string; count: number }[]; rssUrl: string }) {
  return (
    <aside className="space-y-6">
      <CopyButton rssUrl={rssUrl} />
      <TaxonomyWidget categories={categories} />
      <LatestCommitsWidget commits={commits} />
    </aside>
  );
}
