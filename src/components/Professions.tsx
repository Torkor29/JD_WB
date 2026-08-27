"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { professions } from "@/lib/capabilities";
import { FeatureMotion } from "./FeatureMotion";
import { Reveal } from "./Reveal";
import { TextRollButton } from "./TextRollButton";

export function Professions() {
  const [active, setActive] = useState(0);
  const current = professions[active];

  return (
    <section id="metiers" className="section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_90%_20%,rgba(31,94,255,0.1),transparent_55%)]"
      />
      <div className="container-site relative">
        <Reveal>
          <div className="mb-5 flex items-center gap-3 sm:mb-8">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              3
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-ink sm:px-4 sm:py-1.5 sm:text-[13px]">
              Métiers
            </span>
          </div>
          <h2 className="headline max-w-3xl text-display-lg">
            Je m’adapte à
            <span className="text-accent"> votre profession.</span>
          </h2>
          <p className="lede mt-4 sm:mt-5">
            Santé, commerce, libéral, startup, association… le produit suit
            votre quotidien — pas l’inverse.
          </p>
        </Reveal>

        {/* Mobile */}
        <div className="mt-8 lg:hidden">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            {professions.map((item, i) => {
              const selected = active === i;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    selected
                      ? "border-accent bg-accent text-white shadow-soft"
                      : "border-line bg-white text-ink"
                  }`}
                  aria-pressed={selected}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-4 rounded-[1.35rem] border border-line bg-white p-4 shadow-card"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Exemple
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight">
                {current.need}
              </h3>
              <div className="mt-4">
                <FeatureMotion id={current.motion} compact />
              </div>
              <div className="mt-5">
                <TextRollButton href="#contact" variant="ink" className="w-full justify-between">
                  Parler de mon métier
                </TextRollButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop */}
        <div className="mt-12 hidden gap-12 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <ul className="space-y-2">
              {professions.map((item, i) => {
                const selected = active === i;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                        selected
                          ? "border-accent bg-accent text-white shadow-lift"
                          : "border-line bg-white hover:border-accent/30 hover:shadow-soft"
                      }`}
                      data-cursor="interactive"
                      aria-pressed={selected}
                    >
                      <span>
                        <span className="block font-display text-lg tracking-tight md:text-xl">
                          {item.label}
                        </span>
                        <span
                          className={`mt-1 block text-sm ${
                            selected ? "text-white/80" : "text-muted"
                          }`}
                        >
                          {item.need}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 text-lg ${
                          selected ? "text-white" : "text-accent"
                        }`}
                        aria-hidden
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-[1.7rem] border border-line bg-white p-8 shadow-card">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/15 blur-3xl"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    Exemple pour {current.label.toLowerCase()}
                  </p>
                  <h3 className="mt-3 font-display text-display-md">
                    {current.need}
                  </h3>
                  <p className="mt-3 max-w-md text-muted">
                    Voici à quoi peut ressembler une fonctionnalité adaptée —
                    animée, concrète, prête à convaincre vos clients.
                  </p>
                  <div className="mt-6 max-w-md">
                    <FeatureMotion id={current.motion} />
                  </div>
                  <div className="mt-8">
                    <TextRollButton href="#contact" variant="ink">
                      Parler de mon métier
                    </TextRollButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
