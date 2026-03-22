import projectsData from "@/data/content/projects.json";
import type { Project, ProjectsData } from "@/types";

export function getProjects(): ProjectsData {
  return projectsData as ProjectsData;
}

export function getProjectSlug(project: Project): string {
  return project.title.toLowerCase().replace(/\s+/g, "-");
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().projects.find((p) => p.id === id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().projects.find((p) => getProjectSlug(p) === slug);
}

export function getFeaturedProject(): Project | undefined {
  return getProjects().projects.find((p) => p.status === "in-progress");
}

export function getCompletedProjects(): Project[] {
  return getProjects().projects.filter((p) => p.status === "completed");
}
