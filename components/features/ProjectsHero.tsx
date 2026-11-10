"use client";

import { getProjects } from "@/lib/data";
import { FadeIn } from "@/components/ui";

export function ProjectsHero() {
  const projects = getProjects().projects;
  const inProgressProject = projects.find((p) => p.status === "in-progress");

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 text-center md:text-left">
      <FadeIn>
        <h1 className="font-serif text-6xl lg:text-8xl text-foreground mb-4">
          Projects
        </h1>
      </FadeIn>
    </section>
  );
}
