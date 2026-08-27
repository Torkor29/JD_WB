"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-white/90 shadow-soft backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex h-[72px] items-center justify-between gap-4">
        <a href="#top" className="group flex flex-col leading-none" data-cursor="interactive">
          <span className="font-display text-[1.15rem] font-bold tracking-[-0.03em] text-ink">
            Julien <span className="text-accent">DOLOU</span>
          </span>
          <span className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-ink">
            Produits numériques
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-sm font-medium text-muted transition-colors hover:text-ink"
              data-cursor="interactive"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#devis" className="btn btn-secondary hidden px-4 py-2.5 text-sm sm:inline-flex" data-cursor="interactive">
            Devis
          </a>
          <a href="#contact" className="btn btn-primary hidden sm:inline-flex" data-cursor="interactive">
            Parler de mon projet
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span className={`h-px w-full bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-full bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-px w-full bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-line bg-white px-4 py-6 lg:hidden"
            aria-label="Navigation mobile"
          >
            <ul className="flex flex-col gap-4">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-display text-2xl text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a href="#contact" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
                  Parler de mon projet
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
