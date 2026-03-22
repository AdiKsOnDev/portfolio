import experienceData from "@/data/content/experience.json";
import type { ExperienceData } from "@/types";

export function getExperience(): ExperienceData {
  return experienceData as ExperienceData;
}
