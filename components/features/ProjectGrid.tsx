import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjectSlug, getCompletedProjects } from "@/lib/data";
import type { Project } from "@/types";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${getProjectSlug(project)}`}
      className="group bg-card border border-muted-border p-6 flex flex-col hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <ArrowUpRight className="w-5 h-5 text-secondary group-hover:text-accent transition-colors flex-shrink-0" />
      </div>
      <p className="text-secondary text-sm leading-relaxed flex-1">
        {project.description}
      </p>
      <div className="mt-4 pt-4 border-t border-muted-border">
        <span className="text-xs uppercase tracking-wider text-secondary">
          {project.year}
        </span>
      </div>
    </Link>
  );
}

export function ProjectGrid() {
  const projects = getCompletedProjects();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
