"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { TextRollButton } from "./TextRollButton";

function useParisTime() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("fr-FR", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const time = useParisTime();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-[1440px] p-2 sm:p-3">
          <div
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-full bg-white p-[5px] shadow-[0_2px_16px_rgba(11,31,58,0.06)] transition ${
              scrolled ? "shadow-[0_8px_28px_rgba(11,31,58,0.1)]" : ""
            }`}
          >
            <div className="flex items-center gap-4 pl-1">
              <a
                href="#top"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[10px] font-bold tracking-tight text-white sm:h-10 sm:w-10 sm:text-[11px]"
                data-cursor="interactive"
              >
                JD
              </a>
              <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation">
                {siteConfig.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-[14px] text-ink transition-colors duration-300 hover:text-muted"
                    data-cursor="interactive"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="hidden items-center gap-4 pr-1 md:flex">
              <span className="hidden text-[13px] text-muted lg:inline">
                Ouvert aux nouveaux projets
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <Clock size={14} />
                {time} à Brest
              </span>
              <TextRollButton href="#contact" variant="ink">
                Parler de mon projet
              </TextRollButton>
            </div>

            <button
              type="button"
              className="mr-0.5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-sheet"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
              {open ? "Fermer" : "Menu"}
            </button>
          </div>
        </div>
      </header>

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
              className="absolute inset-0 bg-ink/60"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center gap-2 text-[13px] text-muted">
                <Clock size={14} />
                {time} à Brest
              </div>
              <ul className="space-y-4">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block text-[28px] font-medium leading-[32px] text-ink"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8" onClick={() => setOpen(false)}>
                <TextRollButton href="#contact" variant="accent" className="w-full justify-between">
                  Démarrer un projet
                </TextRollButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
