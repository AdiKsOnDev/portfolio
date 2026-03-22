"use client";

import { getFeaturedProject } from "@/lib/data";
import { Github, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/ui";

export function CurrentWork() {
  const project = getFeaturedProject();

  if (!project) return null;

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <span className="text-xs uppercase tracking-wider text-accent font-sans mb-8 block">
            Current Work
          </span>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn delay={100}>
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
                {project.title}
              </h2>
              <p className="text-secondary text-sm leading-relaxed mb-8">
                {project.longDescription}
              </p>
              <div className="flex gap-4">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-sm uppercase tracking-wider hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Github className="w-4 h-4" />
                    View Repository
                  </a>
                )}
                {project.links.documentation && (
                  <a
                    href={project.links.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Documentation
                  </a>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="bg-card border border-muted-border overflow-hidden transition-all duration-300">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  <span className="text-secondary text-sm uppercase">Preview</span>
                </div>
              )}
              <div className="p-4 border-t border-muted-border">
                <span className="text-xs text-secondary font-mono">
                  {project.tags.slice(0, 3).join(" / ")}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
