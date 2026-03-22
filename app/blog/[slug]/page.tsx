import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts, getLatestPostsSync } from "@/lib/data";
import { extractHeadings, type Heading } from "@/lib/utils";
import { ContinueReading } from "@/components/features";
import { PostMetadata, TableOfContents } from "@/components/features/PostSidebar";

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

  const allPosts = getLatestPostsSync();
  const headings: Heading[] = extractHeadings(post.content || "");

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

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
          <header className="mb-12">
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

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h2 id={id} className="font-serif text-2xl text-foreground mt-12 mb-6 scroll-mt-24">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h3 id={id} className="font-serif text-xl text-foreground mt-8 mb-4 scroll-mt-24">
                      {children}
                    </h3>
                  );
                },
                p: ({ children }) => (
                  <p className="text-foreground leading-relaxed mb-6">
                    {children}
                  </p>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-code-bg text-accent px-2 py-1 text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-code-bg text-code-foreground p-6 rounded-lg overflow-x-auto text-sm font-mono my-6">
                      {children}
                    </code>
                  );
                },
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-6 text-secondary">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-secondary">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-accent pl-6 my-6 italic text-secondary">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-accent hover:underline"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>

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
            <ContinueReading posts={allPosts} currentSlug={post.slug} />
          </div>
        </aside>
      </div>
    </article>
  );
}
