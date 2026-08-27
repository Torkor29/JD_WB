"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { capabilityCards } from "@/lib/capabilities";
import { FeatureMotion } from "./FeatureMotion";
import { Reveal } from "./Reveal";
import { TextRollButton } from "./TextRollButton";

export function Solutions() {
  const [active, setActive] = useState(0);
  const current = capabilityCards[active];

  return (
    <section id="solutions" className="section-pad relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container-site relative">
        <Reveal>
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              1
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-ink sm:px-4 sm:py-1.5 sm:text-[13px]">
              Ce que je construis
            </span>
          </div>
          <h2 className="headline max-w-3xl text-display-lg">
            Des produits vivants.
            <span className="block text-accent">Pas des pages figées.</span>
          </h2>
          <p className="lede mt-5">
            Sites, apps, prise de RDV, fidélité, outils métiers — chaque option
            peut s’animer pour montrer concrètement ce que ça donne.
          </p>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <Reveal>
            <div className="space-y-3">
              {capabilityCards.map((item, i) => {
                const selected = active === i;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`group flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition duration-300 ${
                      selected
                        ? "border-accent/40 bg-white shadow-lift"
                        : "border-line bg-paper-soft/40 hover:border-accent/25 hover:bg-white hover:shadow-soft"
                    }`}
                    data-cursor="interactive"
                    aria-pressed={selected}
                  >
                    <span
                      className={`mt-0.5 font-display text-sm ${
                        selected ? "text-accent" : "text-muted"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-xl tracking-tight md:text-2xl">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {item.text}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-line bg-gradient-to-br from-paper-soft via-white to-accent-soft/50 p-5 shadow-card md:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {current.motion ? (
                    <FeatureMotion id={current.motion} />
                  ) : (
                    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                        Aperçu
                      </p>
                      <p className="mt-4 font-display text-3xl tracking-tight">
                        Une vitrine qui convertit
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        Structure claire, appel à l’action, design adapté à
                        votre métier — pas un template recyclé.
                      </p>
                      <div className="mt-6 grid grid-cols-3 gap-2">
                        {["Hero", "Offre", "Contact"].map((label, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                            className="rounded-xl bg-paper-soft px-3 py-4 text-center text-xs font-semibold text-ink shadow-soft"
                          >
                            {label}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-xs text-sm text-muted">
                  Survolez une option pour voir le motion associé.
                </p>
                <TextRollButton href="#devis" variant="accent">
                  Estimer ce besoin
                </TextRollButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
