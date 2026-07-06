import { MotionHero, CurrentWork, SelectedWorks, LatestThoughts, Contact } from "@/components/features";

export default function HomePage() {
  return (
    <>
      <MotionHero />
      <div id="current-work" className="scroll-mt-16">
        <CurrentWork />
      </div>
      <SelectedWorks />
      <LatestThoughts />
      <div id="contact" className="scroll-mt-16">
        <Contact />
      </div>
    </>
  );
}
