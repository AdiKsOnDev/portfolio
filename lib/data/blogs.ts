import blogsIndex from "@/data/content/blogs/index.json";
import type { BlogPost, BlogIndex, BlogData } from "@/types";

function getBlogFiles() {
  return {
    "commit-committed-or-was-committed": () =>
      import("@/data/content/blogs/commit-committed-or-was-committed.json"),
    "genai-is-supposed-to-be-convenient": () =>
      import("@/data/content/blogs/genai-is-supposed-to-be-convenient.json"),
  };
}

export async function getBlogIndex(): Promise<BlogIndex> {
  return blogsIndex as BlogIndex;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return (blogsIndex as BlogIndex).posts;
}

export async function getFeaturedPost(): Promise<BlogPost | undefined> {
  return (blogsIndex as BlogIndex).posts.find((p) => p.featured);
}

export async function getLatestPosts(limit?: number): Promise<BlogPost[]> {
  const posts = (blogsIndex as BlogIndex).posts
    .filter((p) => !p.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  return limit ? posts.slice(0, limit) : posts;
}

export async function getPostBySlug(slug: string): Promise<BlogData | undefined> {
  const blogFiles = getBlogFiles();
  const moduleFn = blogFiles[slug as keyof typeof blogFiles];
  if (!moduleFn) return undefined;
  const module = await moduleFn();
  return module.default as BlogData;
}

export function getLatestPostsSync(limit?: number): BlogPost[] {
  const posts = (blogsIndex as BlogIndex).posts
    .filter((p) => !p.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  return limit ? posts.slice(0, limit) : posts;
}

export function getBlogCategoriesSync(): { name: string; count: number }[] {
  const posts = (blogsIndex as BlogIndex).posts;
  const categoryCounts: Record<string, number> = {};

  posts.forEach((post) => {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
