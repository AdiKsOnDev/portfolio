"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, Plus, Trash2, FileText } from "lucide-react";
import { slugify } from "@/lib/utils";
import { Button, TextInput, TextArea, Checkbox, StringList, nextId } from "./fields";
import { MarkdownEditor } from "./MarkdownEditor";
import type { BlogData, BlogPost } from "@/types";

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function blankBlog(posts: BlogPost[]): BlogData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: nextId(posts),
    slug: "",
    title: "",
    excerpt: "",
    coverImage: "",
    publishedAt: today,
    readTime: "",
    category: "",
    tags: [],
    author: "Adil Alizada",
    featured: false,
    content: "",
  };
}

export function BlogsAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogData | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ msg: string; error?: boolean } | null>(null);

  const loadList = useCallback(async () => {
    const res = await fetch("/api/admin/blogs");
    const d = await res.json();
    setPosts(d.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadList().catch((e) => {
      setStatus({ msg: String(e), error: true });
      setLoading(false);
    });
  }, [loadList]);

  const selectPost = async (slug: string) => {
    setStatus(null);
    const res = await fetch(`/api/admin/blogs/${slug}`);
    if (!res.ok) {
      setStatus({ msg: "Failed to load post", error: true });
      return;
    }
    setEditing(await res.json());
    setOriginalSlug(slug);
  };

  const newPost = () => {
    setEditing(blankBlog(posts));
    setOriginalSlug(null);
    setStatus(null);
  };

  const patch = (p: Partial<BlogData>) =>
    setEditing((prev) => (prev ? { ...prev, ...p } : prev));

  const onTitle = (title: string) => {
    // auto-derive the slug while creating a brand-new post
    if (originalSlug === null) patch({ title, slug: slugify(title) });
    else patch({ title });
  };

  const save = async () => {
    if (!editing) return;
    if (!/^[a-z0-9-]+$/.test(editing.slug)) {
      setStatus({ msg: "Slug must be lowercase letters, numbers and hyphens", error: true });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const post: BlogData = {
        ...editing,
        readTime: editing.readTime.trim() || estimateReadTime(editing.content ?? ""),
      };
      const res = await fetch(`/api/admin/blogs/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post, originalSlug: originalSlug ?? undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save failed");
      setEditing(post);
      setOriginalSlug(post.slug);
      await loadList();
      setStatus({ msg: "Saved to disk" });
    } catch (e) {
      setStatus({ msg: (e as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm(`Delete post "${slug}"? This removes its file.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blogs/${slug}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Delete failed");
      if (originalSlug === slug) {
        setEditing(null);
        setOriginalSlug(null);
      }
      await loadList();
      setStatus({ msg: `Deleted ${slug}` });
    } catch (e) {
      setStatus({ msg: (e as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-secondary">Loading…</p>;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* list */}
      <div className="lg:col-span-1">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-secondary">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={newPost}
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-accent hover:underline"
          >
            <Plus className="h-3 w-3" /> New
          </button>
        </div>
        <ul className="space-y-1">
          {posts.map((post) => (
            <li key={post.slug}>
              <div
                className={`group flex items-center gap-1 border px-3 py-2 ${
                  originalSlug === post.slug
                    ? "border-accent bg-card"
                    : "border-muted-border hover:border-accent/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectPost(post.slug)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm text-foreground">
                    {post.title || "(untitled)"}
                  </span>
                  <span className="block truncate font-mono text-xs text-secondary">
                    {post.slug}
                    {post.featured ? " · featured" : ""}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => remove(post.slug)}
                  aria-label="Delete"
                  className="text-secondary opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* editor */}
      <div className="lg:col-span-3">
        {!editing ? (
          <p className="flex items-center gap-2 text-sm text-secondary">
            <FileText className="h-4 w-4" /> Select a post, or start a new one.
          </p>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="accent" onClick={save} disabled={busy}>
                <Save className="h-4 w-4" />
                {busy ? "Working…" : "Save to disk"}
              </Button>
              {status && (
                <span
                  className={`text-xs ${status.error ? "text-red-500" : "text-secondary"}`}
                >
                  {status.msg}
                </span>
              )}
            </div>

            <TextInput label="Title" value={editing.title} onChange={onTitle} />
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Slug"
                value={editing.slug}
                onChange={(v) => patch({ slug: v })}
                mono
                hint={originalSlug && originalSlug !== editing.slug ? "Renaming file" : undefined}
              />
              <TextInput
                label="Category"
                value={editing.category}
                onChange={(v) => patch({ category: v })}
              />
            </div>
            <TextArea
              label="Excerpt"
              value={editing.excerpt}
              onChange={(v) => patch({ excerpt: v })}
              rows={2}
            />
            <TextInput
              label="Cover image URL"
              value={editing.coverImage}
              onChange={(v) => patch({ coverImage: v })}
              mono
            />
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label="Published"
                value={editing.publishedAt}
                onChange={(v) => patch({ publishedAt: v })}
                placeholder="YYYY-MM-DD"
                mono
              />
              <TextInput
                label="Read time"
                value={editing.readTime}
                onChange={(v) => patch({ readTime: v })}
                hint="blank = auto"
              />
              <TextInput
                label="Author"
                value={editing.author}
                onChange={(v) => patch({ author: v })}
              />
            </div>
            <StringList
              label="Tags"
              value={editing.tags}
              onChange={(v) => patch({ tags: v })}
            />
            <Checkbox
              label="Featured"
              checked={editing.featured}
              onChange={(v) => patch({ featured: v })}
            />

            {/* markdown editor + live preview */}
            <div>
              <span className="mb-1 block text-xs uppercase tracking-wider text-secondary">
                Content (Markdown)
              </span>
              <MarkdownEditor
                value={editing.content ?? ""}
                onChange={(v) => patch({ content: v })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
