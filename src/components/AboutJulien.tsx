"use client";

import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";
import { ScrollRevealText } from "./ScrollRevealText";
import { siteConfig } from "@/lib/site";

export function AboutJulien() {
  return (
    <section id="histoire" className="section-pad overflow-hidden bg-white">
      <div className="container-site">
        <div className="overflow-hidden rounded-[1.5rem] border border-line bg-paper-soft px-5 py-12 text-center shadow-soft sm:rounded-[2rem] sm:px-10 sm:py-16 md:px-14 md:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent sm:text-xs">
            {siteConfig.name} · Bretagne
          </p>

          <div className="mx-auto mt-8 max-w-3xl text-[clamp(1.6rem,4.2vw,3.25rem)] leading-[1.05]">
            <WordsPullUpMultiStyle
              segments={[
                {
                  text: `Je suis ${siteConfig.founder},`,
                  className: "font-normal text-ink",
                },
                {
                  text: "fondateur de TiCode.",
                  className: "font-serif italic text-ink",
                },
                {
                  text: "Je construis des produits numériques adaptés à chaque métier.",
                  className: "font-normal text-ink",
                },
              ]}
            />
          </div>

          <ScrollRevealText
            className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-muted sm:mt-10 sm:text-base"
            text="Depuis Brest, au bord de l’Atlantique, TiCode accompagne entrepreneurs, commerces et structures qui veulent un vrai outil — site, app ou logiciel métier — pas un template. Un seul interlocuteur, du cadrage au lancement."
          />
        </div>
      </div>
    </section>
  );
}
