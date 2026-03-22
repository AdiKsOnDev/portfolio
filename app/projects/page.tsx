import { getProjects } from "@/lib/data";
import { ProjectsHero, FeaturedProject, ProjectGrid } from "@/components/features";

export default function ProjectsPage() {
  const projects = getProjects().projects;
  const inProgressProject = projects.find((p) => p.status === "in-progress");

  return (
    <>
      <ProjectsHero />
      {inProgressProject && <FeaturedProject project={inProgressProject} />}
      <ProjectGrid />
    </>
  );
}
