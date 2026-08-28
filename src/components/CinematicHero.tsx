"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
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
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden bg-white"
    >
      <div className="absolute inset-0">
        <BeachWorkspaceScene />
        {/* Fondu blanc — asseoir le texte sans cadre flou */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, #fff 0%, transparent 10%, transparent 90%, #fff 100%),
              linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 12%, transparent 55%, rgba(255,255,255,0.88) 82%, #fff 100%)
            `,
          }}
        />
      </div>

      <div className="absolute inset-x-0 top-0 z-30 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-4">
        <nav
          className="flex max-w-[calc(100%-1.25rem)] items-center gap-1 rounded-full border border-line bg-white/90 px-3 py-2 shadow-soft backdrop-blur-md sm:gap-4 sm:px-5 md:gap-8 md:px-7 md:py-2.5 lg:gap-12"
          aria-label="Navigation"
        >
          <a
            href="#top"
            className="px-2 font-display text-[13px] font-bold tracking-tight text-ink"
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
            className="ml-1 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[11px] font-medium text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            <Menu size={14} />
            Menu
          </button>
        </nav>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-end px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="grid max-w-full items-end gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Marque */}
          <div className="min-w-0 lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/50"
            >
              Bretagne
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(3rem,11vw,6rem)] font-bold leading-[0.92] tracking-[-0.035em] text-ink"
            >
              TiCode
              <span className="text-accent">*</span>
            </motion.h1>
          </div>

          {/* Texte + CTA — pas de cadre, typo claire */}
          <div className="flex min-w-0 flex-col gap-7 lg:col-span-6 lg:pb-1">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[22rem] font-display text-[1.15rem] font-medium leading-[1.35] tracking-tight text-ink sm:max-w-md sm:text-[1.35rem] sm:leading-[1.3]"
            >
              Sites, apps, paiements et prise de RDV —
              <span className="font-serif text-[1.05em] font-normal italic text-ink/80">
                {" "}
                conçus pour votre métier.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-ink px-5 py-3.5 text-[14px] font-semibold tracking-tight text-white transition duration-300 hover:bg-accent sm:px-6 sm:text-[15px]"
              >
                Démarrer un projet
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </a>
              <a
                href="#services"
                className="text-[13px] font-medium tracking-tight text-ink/55 underline decoration-ink/15 underline-offset-[5px] transition hover:text-ink hover:decoration-ink/40 sm:text-[14px]"
              >
                Voir ce qu’on construit
              </a>
            </motion.div>
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
              className="absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] rounded-2xl bg-white p-6 shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display font-bold text-ink">TiCode</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-paper-soft"
                >
                  <X size={18} className="text-ink" />
                </button>
              </div>
              <ul className="space-y-1">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-xl px-2 py-3 font-display text-[1.65rem] leading-none tracking-tight text-ink"
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
