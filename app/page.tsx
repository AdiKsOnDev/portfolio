import { Hero, CurrentWork, SelectedWorks, LatestThoughts } from "@/components/features";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CurrentWork />
      <SelectedWorks />
      <LatestThoughts />
    </>
  );
}
