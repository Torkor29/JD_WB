"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { TextRollButton } from "./TextRollButton";

const LiquidHeroBackdrop = dynamic(
  () => import("./LiquidHeroBackdrop").then((m) => m.LiquidHeroBackdrop),
  { ssr: false },
);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#EFEFEF]"
    >
      <LiquidHeroBackdrop />

      {/* soft bottom fade for text readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[48%] bg-gradient-to-t from-[#EFEFEF] via-[#EFEFEF]/75 to-transparent"
      />

      <div className="relative z-20 h-[76px] shrink-0 sm:h-[84px]" />

      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-5 text-[13px] tracking-wide text-ink sm:mb-8 sm:text-[14px]"
        >
          Julien DOLOU — Studio digital
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[18ch] font-display text-[clamp(1.85rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:max-w-none sm:text-[clamp(2.5rem,5vw,4.2rem)]"
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
          className="mt-5 max-w-xl text-[15px] font-medium leading-[1.6] text-ink/80 sm:text-[17px]"
        >
          Sites web, applications et outils métiers — conçus sur mesure pour
          dominer votre catégorie en ligne.
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
        </motion.div>
      </div>
    </section>
  );
}
