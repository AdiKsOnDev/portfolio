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
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-10">
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

      {heroPost && <FeaturedArticle post={heroPost} />}

      <BlogExplorer
        posts={gridPosts}
        rssUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/feed.xml`}
      />
    </>
  );
}
