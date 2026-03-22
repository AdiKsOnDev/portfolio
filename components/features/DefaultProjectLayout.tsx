import Link from "next/link";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/types";

interface DefaultProjectLayoutProps {
  project: Project;
}

export function DefaultProjectLayout({ project }: DefaultProjectLayoutProps) {
  return (
    <article className="max-w-6xl mx-auto px-6 py-24">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-secondary hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Projects</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-muted border border-muted-border mb-8 flex items-center justify-center overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-secondary text-sm uppercase">Preview</span>
            )}
          </div>

          <span className="text-xs uppercase tracking-wider text-accent mb-4 block">
            {project.category}
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">
            {project.title}
          </h1>
          <p className="text-secondary leading-relaxed mb-8">
            {project.longDescription}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider text-secondary border border-muted-border px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                <Github className="w-4 h-4" />
                View Repository
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-muted-border p-6">
            <h3 className="text-xs uppercase tracking-wider text-accent mb-4">
              Project Details
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Status
                </dt>
                <dd className="font-serif text-foreground capitalize">
                  {project.status.replace("-", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Year
                </dt>
                <dd className="font-serif text-foreground">{project.year}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Client
                </dt>
                <dd className="font-serif text-foreground">{project.client}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Role
                </dt>
                <dd className="font-serif text-foreground">{project.role}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Duration
                </dt>
                <dd className="font-serif text-foreground">{project.duration}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-card border border-muted-border p-6">
            <h3 className="text-xs uppercase tracking-wider text-accent mb-4">
              Metrics
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Users
                </dt>
                <dd className="font-serif text-foreground">{project.metrics.users}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Performance
                </dt>
                <dd className="font-serif text-foreground">{project.metrics.performance}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-secondary mb-1">
                  Impact
                </dt>
                <dd className="font-serif text-foreground">{project.metrics.impact}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
