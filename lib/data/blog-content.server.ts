import "server-only";
import fs from "fs";
import path from "path";
import type { BlogData } from "@/types";

const BLOGS_DIR = path.join(process.cwd(), "data", "content", "blogs");

/**
 * Reads a post's full JSON (including `content`) straight from disk. Runs at
 * build time (static export) and per-request in dev, so posts added through the
 * admin panel are picked up without touching a hardcoded import map.
 */
export async function getPostBySlug(slug: string): Promise<BlogData | undefined> {
  // guard against path traversal — slugs are URL-safe kebab-case only
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;

  const file = path.join(BLOGS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;

  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as BlogData;
  } catch {
    return undefined;
  }
}
