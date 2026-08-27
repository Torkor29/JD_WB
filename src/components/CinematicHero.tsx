"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";
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
    <section id="top" className="relative h-[100svh] bg-black p-3 sm:p-4 md:p-6">
      <div className="relative h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* Beach video / cinematic still */}
        <video
          className="absolute inset-0 h-full w-full object-cover animate-kenburns"
          autoPlay
          loop
          muted
          playsInline
          poster="/beach/hero.jpg"
        >
          <source src="/videos/plage-hero.mp4" type="video/mp4" />
        </video>

        <div
          aria-hidden
          className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.75] mix-blend-overlay"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(222,219,200,0.08),transparent_45%)]"
        />

        {/* Hanging nav pill */}
        <div className="absolute inset-x-0 top-0 z-30 flex justify-center">
          <nav
            className="flex items-center gap-1 rounded-b-2xl bg-black px-3 py-2 sm:gap-4 sm:px-5 md:rounded-b-3xl md:px-8 md:py-2.5"
            aria-label="Navigation"
          >
            <div className="hidden items-center gap-3 sm:gap-6 md:flex md:gap-10 lg:gap-14">
              {siteConfig.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[10px] transition-colors sm:text-xs md:text-sm"
                  style={{ color: "rgba(225, 224, 204, 0.8)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E1E0CC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)";
                  }}
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

            <a
              href="#top"
              className="px-2 text-[11px] font-extrabold tracking-tight text-primary md:hidden"
            >
              JD
            </a>

            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] text-primary/80 md:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
            >
              <Menu size={14} />
              Menu
            </button>
          </nav>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 md:p-10 lg:p-12">
          <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-primary/70 sm:text-xs">
                Brest · Bretagne · Bord de mer
              </p>
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[14vw] xl:text-[12vw]"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp text="Julien" showAsterisk />
              </h1>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-3">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md text-xs leading-[1.35] text-primary/70 sm:text-sm md:text-base"
              >
                Breton. Je conçois des sites, apps et outils métiers sur mesure
                — depuis la côte, pour des professionnels partout en France.
              </motion.p>

              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base sm:pl-6"
              >
                Démarrer un projet
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight size={16} className="text-primary" />
                </span>
              </motion.a>
            </div>
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
              className="absolute inset-0 bg-black/70"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-3 bottom-3 rounded-2xl bg-[#101010] p-6"
            >
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={() => setOpen(false)} aria-label="Fermer">
                  <X size={18} className="text-primary" />
                </button>
              </div>
              <ul className="space-y-4">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block text-2xl text-primary"
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
