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
    <div>
      <h4 className="text-xs uppercase tracking-wider text-secondary mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li
            key={heading.id}
            className={`${
              heading.level === 3 ? "pl-3" : ""
            }`}
          >
            <button
              onClick={() => {
                const element = document.getElementById(heading.id);
                element?.scrollIntoView({ behavior: "smooth" });
                setActiveId(heading.id);
              }}
              className={`text-left text-sm transition-colors w-full ${
                activeId === heading.id
                  ? "text-accent underline"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              {String(index + 1).padStart(2, "0")}. {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
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
