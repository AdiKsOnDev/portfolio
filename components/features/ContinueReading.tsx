import Link from "next/link";
import type { BlogPost } from "@/types";

interface ContinueReadingProps {
  posts: BlogPost[];
  currentSlug?: string;
}

export function ContinueReading({ posts, currentSlug }: ContinueReadingProps) {
  const otherPosts = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (otherPosts.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-secondary mb-4">
        Continue Reading
      </h4>
      <ul className="space-y-4">
        {otherPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <span className="text-sm font-serif text-foreground group-hover:text-accent transition-colors">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
