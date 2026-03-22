import Link from "next/link";
import { getLatestPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function LatestThoughts() {
  const posts = await getLatestPosts(2);

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-wider text-accent font-sans lg:writing-mode-vertical [writing-mode:vertical-rl] rotate-180">
              Latest Thoughts
            </span>
          </div>

          <div className="lg:col-span-10 space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
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
        </div>
      </div>
    </section>
  );
}
