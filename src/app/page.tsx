import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Approach } from "@/components/Approach";
import { Solutions } from "@/components/Solutions";
import { Portfolio } from "@/components/Portfolio";
import { Method } from "@/components/Method";
import { Audience } from "@/components/Audience";
import { Differentiation } from "@/components/Differentiation";
import { IntentPicker } from "@/components/IntentPicker";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Approach />
        <Solutions />
        <Portfolio />
        <Method />
        <Audience />
        <Differentiation />
        <IntentPicker />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
