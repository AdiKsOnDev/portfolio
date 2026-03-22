import Link from "next/link";
import type { BlogPost } from "@/types";

interface ArticleListProps {
  posts: BlogPost[];
}

export function ArticleList({ posts }: ArticleListProps) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex gap-6 items-start"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-wider text-accent">
                {post.category}
              </span>
              <span className="text-xs text-secondary">·</span>
              <span className="text-xs text-secondary">{post.readTime}</span>
            </div>
            <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          {post.coverImage && (
            <div className="w-24 h-24 bg-muted border border-muted-border overflow-hidden flex-shrink-0">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
