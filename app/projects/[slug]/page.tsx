import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlug, getProjects } from "@/lib/data";
import { DefaultProjectLayout } from "@/components/features";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects().projects;
  return projects.map((project) => ({
    slug: getProjectSlug(project),
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Adil Alizada`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <DefaultProjectLayout project={project} />;
}
