"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/types";
import type { Heading } from "@/lib/utils";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <h4 className="text-xs uppercase tracking-wider text-secondary mb-4">
        On This Page
      </h4>
      <ul className="border-l border-muted-border">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <button
                onClick={() => {
                  const element = document.getElementById(heading.id);
                  element?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }}
                title={heading.text}
                className={`-ml-px block w-full border-l-2 py-1.5 text-left text-sm leading-snug transition-colors line-clamp-2 ${
                  heading.level === 3 ? "pl-7" : "pl-4"
                } ${
                  isActive
                    ? "border-accent text-accent font-medium"
                    : "border-transparent text-secondary hover:border-muted-border hover:text-foreground"
                }`}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface PostMetadataProps {
  post: BlogPost;
}

export function PostMetadata({ post }: PostMetadataProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-wider text-secondary block mb-1">
          Published
        </span>
        <span className="font-serif text-sm text-foreground">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div>
        <span className="text-xs uppercase tracking-wider text-secondary block mb-1">
          Reading Time
        </span>
        <span className="font-serif italic text-sm text-accent">
          {post.readTime}
        </span>
      </div>
      <div>
        <span className="text-xs uppercase tracking-wider text-secondary block mb-1">
          Topic
        </span>
        <span className="font-serif italic text-sm text-foreground">
          {post.category}
        </span>
      </div>
    </div>
  );
}
