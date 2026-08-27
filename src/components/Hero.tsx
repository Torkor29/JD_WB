"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { TextRollButton } from "./TextRollButton";
import { ProductMorph } from "./ProductMorph";

const HeroShaderBackground = dynamic(
  () =>
    import("./HeroShaderBackground").then((m) => m.HeroShaderBackground),
  { ssr: false },
);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#F5F8FC]"
    >
      {!reduce && <HeroShaderBackground />}

      {/* spacer under floating pill nav */}
      <div className="relative z-20 h-[72px] shrink-0" />

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-[13px] tracking-wide text-ink sm:mb-8 sm:text-[14px]"
          >
            Julien DOLOU — Studio digital
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[clamp(2.5rem,5vw,4.2rem)]"
          >
            Vous avez une idée.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-accent">Je la transforme</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            en produit numérique.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 max-w-xl text-[15px] leading-[1.6] text-muted sm:text-[17px]"
          >
            Sites web sur mesure, applications mobiles, plateformes et outils
            métiers — conçus pour votre besoin, pas pour un template.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5"
          >
            <TextRollButton href="#contact" variant="accent">
              Démarrer un projet
            </TextRollButton>
            <TextRollButton href="#devis" variant="ghost">
              Estimer mon devis
            </TextRollButton>
            <a
              href="#realisations"
              className="text-[13px] font-semibold text-accent underline-offset-4 hover:underline sm:text-[14px]"
              data-cursor="interactive"
            >
              Voir les réalisations
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 hidden w-full max-w-[420px] lg:mt-0 lg:block"
        >
          <ProductMorph />
        </motion.div>
      </div>
    </section>
  );
}
