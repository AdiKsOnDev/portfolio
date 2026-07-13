"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCompletedProjects, getProjectSlug } from "@/lib/data";
import { FadeIn } from "@/components/ui";
import type { Project } from "@/types";

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <FadeIn delay={delay} className="flex h-full">
      <Link
        href={`/projects/${getProjectSlug(project)}`}
        className="group flex h-full flex-col overflow-hidden border border-muted-border bg-card transition-all duration-300 hover:border-accent/50"
      >
        <div className="aspect-video overflow-hidden border-b border-muted-border bg-muted">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-secondary">
                {project.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-secondary transition-colors group-hover:text-accent" />
          </div>
          <p className="flex-1 text-sm leading-relaxed text-secondary">
            {project.description}
          </p>
          <div className="mt-4 border-t border-muted-border pt-4">
            <span className="text-xs uppercase tracking-wider text-secondary">
              {project.year}
            </span>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

export function ProjectGrid() {
  const projects = getCompletedProjects();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <FadeIn>
        <h2 className="font-serif text-3xl text-foreground mb-12">
          Other Projects
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i * 50} />
        ))}
      </div>
    </section>
  );
}
