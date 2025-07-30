import {
  AboutCTA,
  Count,
  HeroSection,
  MenuFooter,
  MissionAndVision,
  Navbar,
  Team,
  Values,
} from "@/components";

export default function About() {
  return (
    <>
      <Navbar search={false} />
      <HeroSection />
      <MissionAndVision />
      <Values />
      <Count />
      <Team />
      <AboutCTA />
      <MenuFooter />
    </>
  );
}
