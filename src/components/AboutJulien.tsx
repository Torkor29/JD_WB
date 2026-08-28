"use client";

import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";
import { ScrollRevealText } from "./ScrollRevealText";
import { siteConfig } from "@/lib/site";

export function AboutJulien() {
  return (
    <section id="histoire" className="section-pad overflow-x-clip bg-white">
      <div className="container-site">
        <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-line bg-paper-soft px-4 py-10 text-center shadow-soft sm:rounded-[2rem] sm:px-10 sm:py-16 md:px-14 md:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-accent sm:text-xs">
            Histoire
          </p>

          <div className="mx-auto mt-6 max-w-3xl min-w-0 px-1 text-[clamp(1.45rem,4vw,2.85rem)] leading-[1.12] sm:mt-8">
            <WordsPullUpMultiStyle
              segments={[
                {
                  text: "Julien,",
                  className: "font-normal text-ink",
                },
                {
                  text: "fondateur de TiCode.",
                  className: "font-serif italic text-ink",
                },
              ]}
            />
          </div>

          <ScrollRevealText
            className="mx-auto mt-8 max-w-2xl text-left text-[14px] leading-relaxed text-ink/80 sm:mt-10 sm:text-center sm:text-base md:text-[1.05rem]"
            text="Depuis petit, je suis passionné par le numérique — curieux de tout, toujours en train de comprendre comment ça marche. J’ai tout appris en autodidacte, année après année, en construisant, en cassant, en recommençant."
          />

          <ScrollRevealText
            className="mx-auto mt-5 max-w-2xl text-left text-[14px] leading-relaxed text-ink/70 sm:mt-6 sm:text-center sm:text-base"
            text="Ce que j’aime le plus : le contact. Écouter un besoin réel, le relier au terrain, et livrer un site ou une application modulable, claire, adaptée aux gens qui l’utilisent au quotidien. Depuis Brest, au bord de l’Atlantique."
          />

          <p className="mx-auto mt-8 max-w-lg text-[13px] leading-relaxed text-muted sm:text-sm">
            Un seul interlocuteur — du premier échange au lancement.
            {siteConfig.location ? ` Basé à ${siteConfig.location}.` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
