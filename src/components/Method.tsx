"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

const phases = [
  { n: "01", title: "On échange", text: "Comprendre le projet, le besoin et les objectifs. Sans jargon." },
  { n: "02", title: "On imagine", text: "Définir la meilleure expérience et les fonctionnalités vraiment utiles." },
  { n: "03", title: "On conçoit", text: "UX, UI, architecture et parcours — avant d’écrire la moindre ligne inutile." },
  { n: "04", title: "On développe", text: "Construction du produit, itération après itération." },
  { n: "05", title: "On lance", text: "Mise en ligne, publication ou déploiement." },
  { n: "06", title: "On fait évoluer", text: "Maintenance, améliorations et nouvelles fonctionnalités." },
];

export function Method() {
  const [active, setActive] = useState(0);

  return (
    <section id="methode" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">La méthode</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Simple. Claire.
            <span className="block text-accent">Sans mauvaise surprise.</span>
          </h2>
          <p className="lede mt-4 sm:mt-5">
            Une seule façon de travailler — de l’échange au lancement — pour
            avancer vite sans perdre le fil.
          </p>
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-line bg-white shadow-card sm:mt-14 sm:rounded-[1.6rem]">
          {/* Mobile steps */}
          <div className="border-b border-line p-3 lg:hidden">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {phases.map((phase, i) => (
                <button
                  key={phase.n}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    active === i
                      ? "bg-accent text-white"
                      : "bg-paper-soft text-muted"
                  }`}
                >
                  {phase.n} {phase.title.replace("On ", "")}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-4 px-1 pb-2"
              >
                <h3 className="font-display text-2xl tracking-tight">
                  {phases[active].title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {phases[active].text}
                </p>
                <a href="#contact" className="btn btn-primary mt-5 w-full" data-cursor="interactive">
                  Démarrer l’échange
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_1.1fr]">
            <div className="border-r border-line p-2">
              {phases.map((phase, i) => (
                <button
                  key={phase.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition ${
                    active === i ? "bg-accent-soft" : "hover:bg-paper-soft"
                  }`}
                  data-cursor="interactive"
                >
                  <span className={`font-display text-sm ${active === i ? "text-accent" : "text-muted"}`}>
                    {phase.n}
                  </span>
                  <span className={`font-display text-xl tracking-tight ${active === i ? "text-ink" : "text-muted"}`}>
                    {phase.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative min-h-[280px] p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-[7.5rem] leading-none text-accent/20">
                    {phases[active].n}
                  </p>
                  <h3 className="mt-2 font-display text-display-md">{phases[active].title}</h3>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                    {phases[active].text}
                  </p>
                  <a href="#contact" className="btn btn-primary mt-8" data-cursor="interactive">
                    Démarrer l’échange
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
