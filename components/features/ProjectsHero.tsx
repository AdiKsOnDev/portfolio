import { getProjects } from "@/lib/data";

export function ProjectsHero() {
  const projects = getProjects().projects;
  const inProgressProject = projects.find((p) => p.status === "in-progress");

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-4">
        Engineered for{" "}
        <span className="italic text-accent">Performance.</span>
      </h1>
      <p className="text-secondary text-sm max-w-2xl">
        {inProgressProject
          ? inProgressProject.description
          : "A selection of systems programming, web development, and open source projects."}
      </p>
    </section>
  );
}
