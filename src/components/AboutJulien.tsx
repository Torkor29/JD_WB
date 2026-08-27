"use client";

import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";
import { ScrollRevealText } from "./ScrollRevealText";

export function AboutJulien() {
  return (
    <section id="histoire" className="section-pad bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[1.5rem] bg-[#101010] px-5 py-12 text-center sm:rounded-[2rem] sm:px-10 sm:py-16 md:px-16 md:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary sm:text-xs">
            Studio digital · Bretagne
          </p>

          <div className="mx-auto mt-8 max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl">
            <WordsPullUpMultiStyle
              segments={[
                { text: "Je suis Julien DOLOU,", className: "font-normal text-primary-soft" },
                {
                  text: "développeur breton.",
                  className: "font-serif italic text-primary-soft",
                },
                {
                  text: "Je construis des produits numériques adaptés à chaque métier.",
                  className: "font-normal text-primary-soft",
                },
              ]}
            />
          </div>

          <ScrollRevealText
            className="mx-auto mt-10 max-w-2xl text-xs leading-relaxed sm:text-sm md:text-base"
            text="Depuis Brest, au bord de l’Atlantique, j’accompagne entrepreneurs, commerces, professions libérales et structures qui veulent un vrai outil — site, app ou logiciel métier — pas un template recyclé. Un seul interlocuteur, du cadrage au lancement."
          />
        </div>
      </div>
    </section>
  );
}
