import { getFeaturedProject } from "@/lib/data";
import { Github, ExternalLink } from "lucide-react";

export function CurrentWork() {
  const project = getFeaturedProject();

  if (!project) return null;

  return (
    <section className="bg-muted py-24">
      <div className="max-w-6xl mx-auto px-6">
        <span className="text-xs uppercase tracking-wider text-accent font-sans mb-8 block">
          Current Work
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
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
                  className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Documentation
                </a>
              )}
            </div>
          </div>

          <div className="bg-card border border-muted-border overflow-hidden">
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
        </div>
      </div>
    </section>
  );
}
