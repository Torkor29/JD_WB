"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProductMorph } from "./ProductMorph";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      <div className="container-wide relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow mb-5"
          >
            Studio digital · Brest & France
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="headline text-display-xl"
          >
            Vous avez une idée.
            <br />
            <span className="text-accent">Je la transforme</span>
            <br />
            en produit numérique.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lede mt-6 max-w-xl text-lg"
          >
            Création de site web sur mesure, applications mobiles, plateformes
            et outils métiers. Pas de template. Un produit pensé pour votre
            besoin — de la première idée jusqu’à la mise en ligne.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn btn-primary" data-cursor="interactive">
              Parler de mon projet
              <span aria-hidden>→</span>
            </a>
            <a href="#devis" className="btn btn-secondary" data-cursor="interactive">
              Estimer mon devis
            </a>
            <a
              href="#realisations"
              className="link-underline ml-1 text-sm font-semibold text-accent"
              data-cursor="interactive"
            >
              Voir les réalisations
            </a>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 text-sm text-muted"
          >
            Un seul interlocuteur · Web + mobile + outils · Accompagnement A→Z
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductMorph />
        </motion.div>
      </div>
    </section>
  );
}
