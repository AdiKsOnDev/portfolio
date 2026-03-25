import { getFeaturedPost, getLatestPosts, getBlogCategoriesSync } from "@/lib/data";
import { getGitHubCommits } from "@/lib/github";
import { getProfile } from "@/lib/data";
import { FeaturedArticle, ArticleList, SidebarWidgets } from "@/components/features";

export default async function BlogPage() {
  const featuredPost = await getFeaturedPost();
  const posts = await getLatestPosts();
  const profile = getProfile();
  const categories = getBlogCategoriesSync();

  const githubUrl = profile.social.github;
  const username = githubUrl.split("/").pop() || "AdiKsOnDev";

  const commits = await getGitHubCommits(username, 5);

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-4">
          Written with{" "} 
          <span className="italic text-accent">Honesty.</span>
        </h1>
        <p className="font-serif italic text-secondary text-lg max-w-2xl">
          Anything I think about or learn during work—goes here. Sometimes I rant,
          sometimes I share something that I found amusing.
        </p>
      </section>

      {featuredPost && <FeaturedArticle post={featuredPost} />}

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <ArticleList posts={posts} />
          </div>
          <div className="lg:col-span-4">
            <SidebarWidgets commits={commits} categories={categories} rssUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/feed.xml`} />
          </div>
        </div>
      </section>
    </>
  );
}
