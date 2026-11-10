import { getFeaturedPost, getLatestPosts } from "@/lib/data";
import { FeaturedArticle, BlogExplorer } from "@/components/features";
import { FadeIn } from "@/components/ui";

export default async function BlogPage() {
  const featuredPost = await getFeaturedPost();
  const posts = await getLatestPosts();

  // Feature the flagged post, or fall back to the most recent one. Whatever is
  // featured is dropped from the grid below so it isn't shown twice.
  const heroPost = featuredPost ?? posts[0];
  const gridPosts = featuredPost ? posts : posts.slice(1);

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-10 text-center md:text-left">
        <FadeIn>
          <h1 className="font-serif text-6xl lg:text-8xl text-foreground mb-4">
            Blog
          </h1>
        </FadeIn>
      </section>

      {heroPost && <FeaturedArticle post={heroPost} />}

      <BlogExplorer
        posts={gridPosts}
        rssUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/feed.xml`}
      />
    </>
  );
}
