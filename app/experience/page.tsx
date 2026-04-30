import { getExperience } from "@/lib/data";
import { ExperienceHero, ExperienceTimeline } from "@/components/features";

export default function ExperiencePage() {
  const experiences = getExperience().experience;

  return (
    <>
      <ExperienceHero />
      <ExperienceTimeline experiences={experiences} />
    </>
  );
}
