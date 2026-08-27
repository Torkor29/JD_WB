import { CinematicHero } from "@/components/CinematicHero";
import { AboutJulien } from "@/components/AboutJulien";
import { StudioFeatures } from "@/components/StudioFeatures";
import { RealisationsStrip } from "@/components/RealisationsStrip";
import { MethodCinematic } from "@/components/MethodCinematic";
import { ContactCinematic } from "@/components/ContactCinematic";
import { FooterCinematic } from "@/components/FooterCinematic";

export default function HomePage() {
  return (
    <main id="main">
      <CinematicHero />
      <AboutJulien />
      <StudioFeatures />
      <RealisationsStrip />
      <MethodCinematic />
      <ContactCinematic />
      <FooterCinematic />
    </main>
  );
}
