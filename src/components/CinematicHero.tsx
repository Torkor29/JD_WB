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
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-white">
      <div className="absolute inset-0">
        <BeachWorkspaceScene />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, #fff 0%, transparent 12%, transparent 88%, #fff 100%),
              linear-gradient(to bottom, #fff 0%, transparent 10%, transparent 68%, #fff 100%)
            `,
          }}
        />
      </div>

      <div className="absolute inset-x-0 top-0 z-30 flex justify-center pt-3 sm:pt-4">
        <nav
          className="flex items-center gap-1 rounded-full border border-line bg-white/85 px-3 py-2 shadow-soft backdrop-blur-md sm:gap-4 sm:px-5 md:gap-8 md:px-7 md:py-2.5 lg:gap-12"
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
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            <Menu size={14} />
            Menu
          </button>
        </nav>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-end px-5 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
        <div className="grid max-w-full items-end gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/60 sm:text-xs"
            >
              Agence digitale · Bretagne
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.75rem,8vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.03em] text-ink"
              style={{
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.65), 0 12px 40px rgba(255,255,255,0.35)",
              }}
            >
              TiCode
              <span className="align-super text-[0.32em] font-semibold text-accent">
                *
              </span>
            </motion.h1>
          </div>

          <div className="flex min-w-0 flex-col gap-5 lg:col-span-5 lg:pb-2">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md text-[15px] leading-relaxed text-ink/75 sm:text-base"
              style={{
                textShadow: "0 1px 12px rgba(255,255,255,0.8)",
              }}
            >
              Sites, apps, paiements, prise de RDV et outils métiers — construits
              pour votre activité. Depuis la côte, pour toute la France.
            </motion.p>

            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-sm font-medium text-white transition-all hover:gap-3 sm:pl-6 sm:text-[15px]"
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
                <span className="font-display font-bold text-ink">TiCode</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                >
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
