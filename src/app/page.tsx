import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Solutions } from "@/components/Solutions";
import { Portfolio } from "@/components/Portfolio";
import { Method } from "@/components/Method";
import { Professions } from "@/components/Professions";
import { QuoteEstimator } from "@/components/QuoteEstimator";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <Header />
      <main id="main">
        <Hero />
        <Solutions />
        <Portfolio />
        <Method />
        <Professions />
        <QuoteEstimator />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
