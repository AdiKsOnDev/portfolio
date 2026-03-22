"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCompletedProjects, getProjectSlug } from "@/lib/data";
import { FadeIn } from "@/components/ui";
import type { Project } from "@/types";

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <Link
        href={`/projects/${getProjectSlug(project)}`}
        className="group block bg-card border border-muted-border p-6 hover:border-accent/50 transition-all duration-300 h-full"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-secondary group-hover:text-accent transition-colors flex-shrink-0" />
          </div>
          <p className="text-secondary text-sm leading-relaxed mb-4 flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider text-secondary border border-muted-border px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}

function FeaturedProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <Link
        href={`/projects/${getProjectSlug(project)}`}
        className="group bg-muted border border-muted-border p-8 flex flex-col lg:flex-row gap-8 items-start hover:border-accent/50 transition-all duration-300"
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
        {project.image ? (
          <div className="w-full lg:w-72 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full lg:w-48 h-32 bg-foreground/5 flex items-center justify-center">
            <span className="text-secondary text-xs uppercase">Preview</span>
          </div>
        )}
      </Link>
    </FadeIn>
  );
}

export function SelectedWorks() {
  const projects = getCompletedProjects().slice(0, 4);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <FadeIn>
        <h2 className="font-serif text-3xl text-foreground mb-12">
          Selected Works
        </h2>
      </FadeIn>

      <div className="grid grid-cols-2 gap-6">
        {projects.slice(0, 2).map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={100 + i * 50} />
        ))}
      </div>

      <div className="mt-6">
        {projects.slice(2, 3).map((project, i) => (
          <FeaturedProjectCard key={project.id} project={project} delay={200 + i * 50} />
        ))}
      </div>
    </section>
  );
}
