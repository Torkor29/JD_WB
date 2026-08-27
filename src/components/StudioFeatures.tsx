"use client";

import { useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";
import { FeatureMotion } from "./FeatureMotion";
import type { FeatureMotionId } from "@/lib/capabilities";

const services: {
  n: string;
  title: string;
  text: string;
  motion: FeatureMotionId | null;
}[] = [
  {
    n: "01",
    title: "Sites web",
    text: "Vitrines et plateformes pensées pour convertir — jamais un template.",
    motion: null,
  },
  {
    n: "02",
    title: "Applications",
    text: "Mobile ou web : l’outil que vos clients et équipes utilisent vraiment.",
    motion: "dashboard",
  },
  {
    n: "03",
    title: "Prise de RDV",
    text: "Agenda en ligne, confirmations, rappels — sans friction.",
    motion: "rdv",
  },
  {
    n: "04",
    title: "Outils métiers",
    text: "Fidélisation, automatisation, suivi : votre process digitalisé.",
    motion: "suivi",
  },
];

export function StudioFeatures() {
  const [active, setActive] = useState(2);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const current = services[active];

  return (
    <section id="services" ref={ref} className="relative section-pad bg-paper-soft">
      <div className="container-site relative">
        <div className="mx-auto max-w-3xl text-center">
          <WordsPullUpMultiStyle
            className="justify-center text-2xl font-normal sm:text-3xl md:text-4xl"
            segments={[
              {
                text: "Des produits vivants.",
                className: "text-ink",
              },
            ]}
          />
          <div className="mt-2">
            <WordsPullUpMultiStyle
              className="justify-center text-2xl font-normal sm:text-3xl md:text-4xl"
              delay={0.2}
              segments={[
                {
                  text: "Pas des pages figées.",
                  className: "text-accent",
                },
              ]}
            />
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
            Chaque service s’anime pour montrer concrètement ce que TiCode peut
            construire pour vous.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <div className="space-y-3">
            {services.map((item, i) => {
              const selected = active === i;
              return (
                <motion.button
                  key={item.n}
                  type="button"
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : undefined}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                    selected
                      ? "border-accent/30 bg-white shadow-lift"
                      : "border-line bg-white/70 hover:shadow-soft"
                  }`}
                >
                  <span className={`mt-0.5 text-sm font-bold ${selected ? "text-accent" : "text-muted"}`}>
                    {item.n}
                  </span>
                  <span>
                    <span className="block text-lg font-medium tracking-tight text-ink md:text-xl">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{item.text}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-line bg-white p-5 shadow-card md:p-7"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.n}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  Aperçu motion
                </p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-ink">
                  {current.title}
                </h3>
                <div className="mt-5 max-w-md">
                  {current.motion ? (
                    <FeatureMotion id={current.motion} compact />
                  ) : (
                    <div className="rounded-2xl border border-line bg-paper-soft p-5">
                      <div className="grid grid-cols-3 gap-2">
                        {["Hero", "Offre", "Contact"].map((label, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="rounded-xl bg-white px-2 py-4 text-center text-xs font-semibold text-ink shadow-soft"
                          >
                            {label}
                          </motion.div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-muted">
                        Structure claire, CTA, design adapté à votre métier.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3"
            >
              En parler
              <ArrowRight size={14} className="-rotate-45" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
