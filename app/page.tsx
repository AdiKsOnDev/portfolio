import { Hero, CurrentWork, SelectedWorks, LatestThoughts, Contact } from "@/components/features";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CurrentWork />
      <SelectedWorks />
      <LatestThoughts />
      <Contact />
    </>
  );
}
