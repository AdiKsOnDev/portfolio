import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/data";
import { getPostBySlug } from "@/lib/data/blog-content.server";
import { extractHeadings, type Heading } from "@/lib/utils";
import { ContinueReading } from "@/components/features";
import { PostMetadata, TableOfContents } from "@/components/features/PostSidebar";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Adil Alizada`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const headings: Heading[] = extractHeadings(post.content || "");

  return (
    <article className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-secondary hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Blog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-2 hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>

        <div className="lg:col-span-7">
          <header className="mb-12 text-center lg:text-left">
            <span className="text-xs uppercase tracking-wider text-accent mb-4 block">
              {post.category}
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
              {post.title}
            </h1>
            <p className="font-serif italic text-secondary text-lg">
              {post.excerpt}
            </p>
          </header>

          {post.coverImage && (
            <div className="aspect-video bg-muted border border-muted-border mb-12 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <BlogMarkdown content={post.content || ""} />

          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-muted-border">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider text-secondary border border-muted-border px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <PostMetadata post={post} />
          </div>
        </aside>
      </div>

      <ContinueReading posts={allPosts} currentSlug={post.slug} />
    </article>
  );
}
