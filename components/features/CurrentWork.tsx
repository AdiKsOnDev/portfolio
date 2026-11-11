import Image from "next/image";
import Link from "next/link";
import { getFeaturedProject, getProjectSlug } from "@/lib/data";

export function CurrentWork() {
  const project = getFeaturedProject();

  if (!project) return null;

  return (
    <section className="bg-muted py-16 sm:py-20" aria-labelledby="current-work-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="current-work-heading" className="mb-10 font-serif text-3xl text-foreground sm:mb-14 sm:text-4xl">
          Current Work
        </h2>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="mb-4 font-serif text-2xl text-foreground">
              {project.title}
            </h3>
            <p className="text-base leading-relaxed text-foreground">
              {project.longDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/projects/${getProjectSlug(project)}`}
                className="inline-flex min-h-11 items-center bg-foreground px-5 py-3 text-base text-background transition-opacity hover:opacity-80"
              >
                View project
              </Link>
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-base text-foreground underline underline-offset-4 transition-colors hover:text-accent"
                >
                  View repository
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-base text-foreground underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Live demo
                </a>
              )}
              {project.links.documentation && (
                <a
                  href={project.links.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-base text-foreground underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Documentation
                </a>
              )}
            </div>
          </div>
          <figure>
            {project.image && (
              <Image
                src={project.image}
                alt={project.title}
                width={800}
                height={450}
                sizes="(max-width: 1023px) calc(100vw - 3rem), 520px"
                className="h-auto w-full"
              />
            )}
            <figcaption className="mt-4 text-sm leading-relaxed text-secondary">
              {project.tags.slice(0, 3).join(" / ")}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
