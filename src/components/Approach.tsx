"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Comprendre le besoin",
    text: "On clarifie le problème à résoudre, le public concerné et ce qui doit réellement changer.",
  },
  {
    n: "02",
    title: "Imaginer la meilleure solution",
    text: "Pas la solution la plus complexe : celle qui sert le besoin, simplement et durablement.",
  },
  {
    n: "03",
    title: "Concevoir l’expérience",
    text: "Parcours, interface, architecture : chaque détail est pensé pour l’usage réel.",
  },
  {
    n: "04",
    title: "Développer",
    text: "Le produit prend forme. Code propre, solide, prêt à évoluer.",
  },
  {
    n: "05",
    title: "Déployer",
    text: "Mise en ligne, publication ou déploiement — le produit arrive entre les mains de ses utilisateurs.",
  },
  {
    n: "06",
    title: "Faire évoluer",
    text: "Maintenance, améliorations, nouvelles fonctionnalités : le projet continue de vivre.",
  },
];

export function Approach() {
  const [active, setActive] = useState(0);

  return (
    <section id="approche" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Approche</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Un projet numérique
            <span className="text-accent"> ne commence pas par du code.</span>
          </h2>
          <p className="lede mt-5">
            Il commence par une conversation. Ensuite seulement viennent la
            conception, le développement et le lancement.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal delay={0.1}>
            <ol className="relative space-y-0 border-l border-line pl-6">
              {steps.map((step, i) => {
                const isActive = i === active;
                return (
                  <li key={step.n} className="relative pb-8 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="group -ml-6 flex w-full items-start gap-4 text-left"
                      data-cursor="interactive"
                      aria-current={isActive ? "step" : undefined}
                    >
                      <span
                        className={`mt-1.5 inline-flex h-3 w-3 shrink-0 -translate-x-[1.4rem] rounded-full border transition ${
                          isActive
                            ? "border-accent bg-accent shadow-[0_0_0_6px_rgba(31,94,255,0.15)]"
                            : "border-muted/40 bg-white"
                        }`}
                      />
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-3">
                          <span className={`font-display text-sm ${isActive ? "text-accent" : "text-muted"}`}>
                            {step.n}
                          </span>
                          <span
                            className={`font-display text-xl tracking-tight transition ${
                              isActive ? "text-ink" : "text-muted group-hover:text-ink"
                            }`}
                          >
                            {step.title}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem] border border-line bg-white p-8 shadow-card md:p-10">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-6xl text-accent/25 md:text-7xl">
                    {steps[active].n}
                  </p>
                  <h3 className="mt-4 font-display text-display-md">{steps[active].title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
                    {steps[active].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
