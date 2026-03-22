import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCompletedProjects, getProjectSlug } from "@/lib/data";
import type { Project } from "@/types";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${getProjectSlug(project)}`}
      className="group block bg-card border border-muted-border p-6 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <ArrowUpRight className="w-5 h-5 text-secondary group-hover:text-accent transition-colors flex-shrink-0" />
      </div>
      <p className="text-secondary text-sm leading-relaxed mb-4">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs uppercase tracking-wider text-secondary border border-muted-border px-2 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${getProjectSlug(project)}`}
      className="group lg:col-span-2 bg-muted border border-muted-border p-8 flex flex-col lg:flex-row gap-8 items-start hover:border-accent/50 transition-colors"
    >
      <div className="flex-1">
        <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-3">
          {project.title}
        </h3>
        <p className="text-secondary text-sm leading-relaxed mb-4">
          {project.description}
        </p>
        <span className="inline-flex items-center gap-2 text-accent text-sm font-sans group-hover:underline">
          Read Case Study
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <div className="w-full lg:w-48 h-32 bg-foreground/5 flex items-center justify-center">
        <span className="text-secondary text-xs uppercase">Preview</span>
      </div>
    </Link>
  );
}

export function SelectedWorks() {
  const projects = getCompletedProjects().slice(0, 4);
  const featuredProject = getCompletedProjects()[4];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="font-serif text-3xl text-foreground mb-12">
        Selected Works
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.slice(0, 2).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {featuredProject && <FeaturedProjectCard project={featuredProject} />}
        </div>
        <div className="bg-card border border-muted-border p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl text-foreground mb-3">
              The Editor Blog
            </h3>
            <p className="text-secondary text-sm italic">
              Essays on systems programming and the philosophy of code.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-accent text-sm font-sans mt-4 hover:underline inline-flex items-center gap-2"
          >
            Read Latest Post
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
