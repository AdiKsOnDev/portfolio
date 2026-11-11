import Image from "next/image";
import Link from "next/link";
import { getCompletedProjects, getProjectSlug } from "@/lib/data";

export function SelectedWorks() {
  const projects = getCompletedProjects().slice(0, 4);
  const featured = projects[3];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24" aria-labelledby="selected-works-heading">
      <h2 id="selected-works-heading" className="mb-10 font-serif text-3xl text-foreground sm:mb-14 sm:text-4xl">
        Selected Works
      </h2>

      <ul className="space-y-10 sm:space-y-12">
        {projects.slice(0, 3).map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${getProjectSlug(project)}`}
              className="group grid gap-3 md:grid-cols-[1fr_2fr] md:gap-12"
            >
              <h3 className="font-serif text-2xl text-foreground underline-offset-8 group-hover:underline group-focus-visible:underline">
                {project.title}
              </h3>
              <div>
                <p className="max-w-2xl text-base leading-relaxed text-foreground">
                  {project.description}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {project.tags.slice(0, 3).join(" / ")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {featured && (
        <Link
          href={`/projects/${getProjectSlug(featured)}`}
          className="group mt-14 grid items-center gap-8 bg-muted p-6 sm:p-10 lg:grid-cols-2 lg:gap-12"
        >
          <div>
            <h3 className="mb-4 font-serif text-3xl text-foreground underline-offset-8 group-hover:underline group-focus-visible:underline">
              {featured.title}
            </h3>
            <p className="text-base leading-relaxed text-foreground">
              {featured.description}
            </p>
            <span className="mt-6 inline-block text-base text-foreground underline decoration-accent underline-offset-8">
              Read more
            </span>
          </div>
          {featured.image && (
            <Image
              src={featured.image}
              alt={featured.title}
              width={800}
              height={450}
              sizes="(max-width: 639px) calc(100vw - 6rem), (max-width: 1023px) calc(100vw - 8rem), 448px"
              className="h-auto w-full"
            />
          )}
        </Link>
      )}
    </section>
  );
}
