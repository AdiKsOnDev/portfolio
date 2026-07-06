"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { ProjectsAdmin } from "./ProjectsAdmin";
import { ExperienceAdmin } from "./ExperienceAdmin";
import { BlogsAdmin } from "./BlogsAdmin";

const TABS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blogs", label: "Blogs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("projects");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <Terminal className="h-4 w-4" />
          Dev Admin
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground">Content Studio</h1>
        <p className="mt-2 text-sm text-secondary">
          Edits write directly to the JSON files under{" "}
          <code className="bg-muted px-1 font-mono text-xs">data/content</code>. This
          panel only exists while running locally with{" "}
          <code className="bg-muted px-1 font-mono text-xs">next dev</code> — it is
          stripped from the production build.
        </p>
      </header>

      <div className="mb-8 flex gap-6 border-b border-muted-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative -mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "border-accent text-accent"
                : "border-transparent text-secondary hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "projects" && <ProjectsAdmin />}
      {tab === "experience" && <ExperienceAdmin />}
      {tab === "blogs" && <BlogsAdmin />}
    </div>
  );
}
