"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";
import { BeachWorkspaceScene } from "./BeachWorkspaceScene";
import { siteConfig } from "@/lib/site";

export function CinematicHero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-white">
      {/* Scène qui fond doucement dans le blanc */}
      <div className="absolute inset-0">
        <BeachWorkspaceScene />
        {/* Fallback soft edge fade (browsers without mask-composite) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, #fff 0%, transparent 12%, transparent 88%, #fff 100%),
              linear-gradient(to bottom, #fff 0%, transparent 10%, transparent 72%, #fff 100%)
            `,
          }}
        />
      </div>

      {/* Nav pill claire */}
      <div className="absolute inset-x-0 top-0 z-30 flex justify-center pt-3 sm:pt-4">
        <nav
          className="flex items-center gap-1 rounded-full border border-line bg-white/85 px-3 py-2 shadow-soft backdrop-blur-md sm:gap-4 sm:px-5 md:gap-8 md:px-7 md:py-2.5 lg:gap-12"
          aria-label="Navigation"
        >
          <a
            href="#top"
            className="px-2 text-[12px] font-extrabold tracking-tight text-ink"
          >
            TiCode
          </a>
          <div className="hidden items-center gap-4 md:flex md:gap-7 lg:gap-10">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[12px] text-ink/70 transition-colors hover:text-ink md:text-sm"
                onClick={(e) => {
                  const el = document.querySelector(item.href);
                  if (!el) return;
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            <Menu size={14} />
            Menu
          </button>
        </nav>
      </div>

      {/* Contenu */}
      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-end px-5 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-3 text-[11px] uppercase tracking-[0.2em] text-ink/55 sm:text-xs"
            >
              Agence digitale · Bretagne
            </motion.p>
            <h1 className="font-medium leading-[0.88] tracking-[-0.06em] text-[18vw] text-ink sm:text-[14vw] md:text-[11vw] lg:text-[9vw] xl:text-[8vw]">
              <WordsPullUp text="TiCode" showAsterisk />
            </h1>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5 lg:pb-3">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md text-sm leading-relaxed text-ink/70 sm:text-base"
            >
              Sites, apps et outils métiers sur mesure — conçus avec soin, animés
              avec intention. Depuis la côte, pour toute la France.
            </motion.p>

            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm font-medium text-white transition-all hover:gap-3 sm:pl-6 sm:text-base"
            >
              Démarrer un projet
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                <ArrowRight size={16} className="text-white" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-6 shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-extrabold text-ink">TiCode</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Fermer">
                  <X size={18} className="text-ink" />
                </button>
              </div>
              <ul className="space-y-4">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block text-2xl text-ink"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
