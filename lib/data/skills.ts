import skillsData from "@/data/content/skills.json";
import type { SkillsData } from "@/types";

export function getSkills(): SkillsData {
  return skillsData as SkillsData;
}
