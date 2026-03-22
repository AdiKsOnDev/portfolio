export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  social: {
    github: string;
    linkedin: string;
    kaggle: string;
  };
  stats: {
    yearsExperience: string;
    crashouts: string;
  };
}

export interface Contact {
  availability: {
    status: string;
    message: string;
    responseTime: string;
  };
  preferredContact: string;
  workingHours: {
    timezone: string;
    hours: string;
  };
}

export interface Skill {
  name: string;
  level: number;
  yearsOfExperience: number;
  projects: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export interface ExperienceData {
  experience: Experience[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: string;
  status: "in-progress" | "completed" | "archived";
  year: number;
  client: string;
  duration: string;
  role: string;
  links: {
    github?: string;
    demo?: string;
    documentation?: string;
  };
  metrics: {
    users: string;
    performance: string;
    impact: string;
  };
}

export interface ProjectsData {
  projects: Project[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  featured: boolean;
  content?: string;
}

export interface BlogIndex {
  posts: BlogPost[];
}

export interface BlogData extends BlogPost {}

export interface GitHubCommit {
  message: string;
  branch: string;
  timestamp: string;
}
