import "server-only";
import fs from "fs";
import path from "path";
import type {
  BlogData,
  BlogIndex,
  BlogPost,
  ExperienceData,
  ProjectsData,
} from "@/types";

/**
 * Server-only filesystem access for the dev admin panel. Reads and writes the
 * JSON files under data/. Only imported by dev-only `route.dev.ts` handlers, so
 * it never reaches the production (static export) bundle.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "content", "projects.json");
const EXPERIENCE_FILE = path.join(DATA_DIR, "content", "experience.json");
const BLOGS_DIR = path.join(DATA_DIR, "content", "blogs");
const BLOGS_INDEX_FILE = path.join(BLOGS_DIR, "index.json");

const SLUG_RE = /^[a-z0-9-]+$/;

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function writeJson(file: string, data: unknown): void {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/* ----------------------------------- Projects ---------------------------- */

export function getProjects(): ProjectsData {
  return readJson<ProjectsData>(PROJECTS_FILE);
}

export function saveProjects(data: ProjectsData): void {
  if (!data || !Array.isArray(data.projects)) {
    throw new Error("Invalid projects payload: expected { projects: [...] }");
  }
  writeJson(PROJECTS_FILE, data);
}

/* --------------------------------- Experience ---------------------------- */

export function getExperience(): ExperienceData {
  return readJson<ExperienceData>(EXPERIENCE_FILE);
}

export function saveExperience(data: ExperienceData): void {
  if (!data || !Array.isArray(data.experience)) {
    throw new Error("Invalid experience payload: expected { experience: [...] }");
  }
  writeJson(EXPERIENCE_FILE, data);
}

/* ------------------------------------ Blogs ------------------------------ */

export function getBlogIndex(): BlogIndex {
  return readJson<BlogIndex>(BLOGS_INDEX_FILE);
}

/** Full post (with `content`) read from its own file. */
export function getBlog(slug: string): BlogData | undefined {
  if (!isValidSlug(slug)) return undefined;
  const file = path.join(BLOGS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  return readJson<BlogData>(file);
}

/** The metadata that lives in index.json (everything except `content`). */
function toIndexEntry(post: BlogData): BlogPost {
  const meta = { ...post };
  delete (meta as { content?: string }).content;
  return meta as BlogPost;
}

/**
 * Create or update a post. Writes the full `<slug>.json` and syncs its entry in
 * index.json. If `originalSlug` differs from `post.slug`, the old file/entry are
 * removed (rename).
 */
export function saveBlog(post: BlogData, originalSlug?: string): void {
  if (!isValidSlug(post.slug)) {
    throw new Error(`Invalid slug "${post.slug}": use lowercase letters, numbers and hyphens`);
  }

  const renamed = originalSlug && originalSlug !== post.slug;
  if (renamed && !isValidSlug(originalSlug)) {
    throw new Error(`Invalid original slug "${originalSlug}"`);
  }

  // write the content file
  writeJson(path.join(BLOGS_DIR, `${post.slug}.json`), post);

  // sync index.json
  const index = getBlogIndex();
  const entry = toIndexEntry(post);
  const keyToReplace = renamed ? originalSlug : post.slug;
  const existingAt = index.posts.findIndex((p) => p.slug === keyToReplace);
  if (existingAt >= 0) {
    index.posts[existingAt] = entry;
  } else {
    index.posts.push(entry);
  }
  writeJson(BLOGS_INDEX_FILE, index);

  // remove the stale content file on rename
  if (renamed) {
    const oldFile = path.join(BLOGS_DIR, `${originalSlug}.json`);
    if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
  }
}

export function deleteBlog(slug: string): void {
  if (!isValidSlug(slug)) throw new Error(`Invalid slug "${slug}"`);
  const file = path.join(BLOGS_DIR, `${slug}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);

  const index = getBlogIndex();
  index.posts = index.posts.filter((p) => p.slug !== slug);
  writeJson(BLOGS_INDEX_FILE, index);
}
