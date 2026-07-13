import { getFeaturedPost, getLatestPosts, getBlogCategoriesSync } from "@/lib/data";
import { FeaturedArticle, BlogExplorer } from "@/components/features";
import { FadeIn } from "@/components/ui";

export default async function BlogPage() {
  const featuredPost = await getFeaturedPost();
  const posts = await getLatestPosts();
  const categories = getBlogCategoriesSync();

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <FadeIn>
          <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-4">
            Written with{" "}
            <span className="italic text-accent">Honesty.</span>
          </h1>
          <p className="font-serif italic text-secondary text-lg max-w-2xl">
            Anything I think about or learn during work—goes here. Sometimes I rant,
            sometimes I share something that I found amusing.
          </p>
        </FadeIn>
      </section>

      {featuredPost && <FeaturedArticle post={featuredPost} />}

      <BlogExplorer
        posts={posts}
        categories={categories}
        rssUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/feed.xml`}
      />
    </>
  );
}
