"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function ContactCinematic() {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();

    const subject = encodeURIComponent(
      `Nouveau projet TiCode${name ? ` — ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      `Bonjour Julien,\n\n${project}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
    setStatus("ready");
  };

  return (
    <section
      id="contact"
      className="section-pad relative overflow-x-clip bg-white"
    >
      <div className="container-site relative">
        <div className="grid min-w-0 items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Réponse sous 24–48 h
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 max-w-lg font-display text-[clamp(1.85rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-ink"
            >
              Racontez-moi votre idée.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70 sm:text-base"
            >
              Site, app, paiement, RDV… Même floue, votre idée mérite une vraie
              écoute. Je vous réponds perso — clair, sans jargon.
            </motion.p>

            <motion.a
              href={`mailto:${siteConfig.contactEmail}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink/60 transition hover:text-accent"
            >
              <MessageCircle size={16} className="text-accent" />
              {siteConfig.contactEmail}
            </motion.a>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative min-w-0 overflow-hidden rounded-[1.35rem] border border-line bg-paper-soft p-4 shadow-card sm:p-7"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
              animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative grid min-w-0 gap-4 md:grid-cols-2">
              <label className="block min-w-0">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-muted">
                  Nom
                </span>
                <input
                  name="name"
                  required
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-accent/40"
                  placeholder="Votre prénom"
                />
              </label>
              <label className="block min-w-0">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-muted">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-accent/40"
                  placeholder="vous@email.fr"
                />
              </label>
              <label className="block min-w-0 md:col-span-2">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-muted">
                  Votre besoin
                </span>
                <textarea
                  name="project"
                  required
                  rows={5}
                  className="w-full resize-y rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-accent/40"
                  placeholder="Le contexte, l’objectif, ce qui vous freine aujourd’hui…"
                />
              </label>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:col-span-2">
                <button
                  type="submit"
                  className="group inline-flex w-fit items-center gap-2.5 rounded-xl bg-ink px-5 py-3.5 text-[14px] font-semibold tracking-tight text-white transition duration-300 hover:bg-accent sm:text-[15px]"
                >
                  Envoyer à Julien
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </button>
                <AnimatePresence>
                  {status === "ready" && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-accent"
                    >
                      Votre client mail va s’ouvrir…
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
