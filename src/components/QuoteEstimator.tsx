"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { FeatureMotion } from "./FeatureMotion";
import {
  estimateQuote,
  formatEuro,
  quoteExtras,
  quoteProjectTypes,
  quoteScopes,
  type QuoteProjectType,
  type QuoteScope,
} from "@/lib/quote";
import { siteConfig } from "@/lib/site";
import type { FeatureMotionId } from "@/lib/capabilities";

export function QuoteEstimator() {
  const [type, setType] = useState<QuoteProjectType>("site-vitrine");
  const [scope, setScope] = useState<QuoteScope>("complet");
  const [extras, setExtras] = useState<string[]>(["design", "rdv"]);
  const [previewMotion, setPreviewMotion] = useState<FeatureMotionId | null>("rdv");

  const estimate = useMemo(
    () => estimateQuote(type, scope, extras),
    [type, scope, extras],
  );

  const toggleExtra = (id: string) => {
    const extra = quoteExtras.find((e) => e.id === id);
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (extra?.motion) {
      setPreviewMotion(extra.motion);
    }
  };

  const mailBody = encodeURIComponent(
    `Bonjour Julien,\n\nJe souhaite un devis pour : ${
      quoteProjectTypes.find((p) => p.id === type)?.label
    }\nNiveau : ${quoteScopes.find((s) => s.id === scope)?.label}\nOptions : ${
      extras.length
        ? extras
            .map((id) => quoteExtras.find((e) => e.id === id)?.label)
            .join(", ")
        : "aucune"
    }\nEstimation indicative : ${formatEuro(estimate.min)} – ${formatEuro(estimate.max)}\n\nVoici mon projet :\n`,
  );

  const EstimateCard = (
    <div className="rounded-[1.35rem] border border-line bg-ink p-5 text-white shadow-lift sm:rounded-[1.5rem] sm:p-7 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-mist">
        Estimation indicative
      </p>
      <p className="mt-4 font-display text-[1.85rem] leading-tight tracking-tight sm:mt-5 sm:text-4xl md:text-5xl">
        {formatEuro(estimate.min)}
        <span className="mx-1.5 text-white/40 sm:mx-2">–</span>
        {formatEuro(estimate.max)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/70 sm:mt-4">
        Fourchette approximative selon vos choix. Chaque projet est unique : on
        affine ensemble après un échange.
      </p>
      <ul className="mt-4 space-y-1.5 text-sm text-white/80 sm:mt-6 sm:space-y-2">
        <li>• Conception & développement inclus</li>
        <li>• Un seul interlocuteur du début à la fin</li>
        <li className="hidden sm:list-item">• Devis précis après cadrage du besoin</li>
      </ul>
      <a
        href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
          "Demande de devis — estimation site",
        )}&body=${mailBody}`}
        className="btn btn-primary mt-6 w-full sm:mt-8"
        data-cursor="interactive"
      >
        Recevoir un devis précis
        <span aria-hidden>→</span>
      </a>
      <a
        href="#contact"
        className="mt-3 inline-flex w-full justify-center text-sm font-semibold text-accent-mist underline-offset-4 hover:underline sm:mt-4"
      >
        Ou décrire mon projet ici
      </a>
    </div>
  );

  return (
    <section id="devis" className="section-pad relative overflow-hidden bg-paper-soft/50">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 hidden h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:block"
      />
      <div className="container-site relative">
        <Reveal>
          <p className="eyebrow">Estimation</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Combien ça coûte&nbsp;?
            <span className="block text-accent">Voyons ça clairement.</span>
          </h2>
          <p className="lede mt-4 sm:mt-5">
            Une estimation indicative. Activez une option comme la prise de RDV
            pour voir le motion associé.
          </p>
        </Reveal>

        {/* Mobile estimate first */}
        <Reveal className="mt-8 lg:hidden">{EstimateCard}</Reveal>

        <div className="mt-6 grid gap-6 lg:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <Reveal className="rounded-[1.35rem] border border-line bg-white p-4 shadow-card sm:rounded-[1.5rem] sm:p-6 md:p-8">
            <h3 className="font-display text-lg tracking-tight sm:text-xl">1. Type de projet</h3>
            <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3">
              {quoteProjectTypes.map((item) => {
                const active = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`rounded-2xl border px-3.5 py-3.5 text-left transition sm:px-4 sm:py-4 ${
                      active
                        ? "border-accent bg-accent-soft shadow-soft"
                        : "border-line"
                    }`}
                    data-cursor="interactive"
                  >
                    <span className="block font-semibold text-ink">{item.label}</span>
                    <span className="mt-1 block text-sm text-muted">{item.hint}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="mt-6 font-display text-lg tracking-tight sm:mt-8 sm:text-xl">
              2. Niveau d’ambition
            </h3>
            <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-3 sm:gap-3">
              {quoteScopes.map((item) => {
                const active = scope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScope(item.id)}
                    className={`rounded-2xl border px-3.5 py-3.5 text-left transition sm:px-4 sm:py-4 ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-line"
                    }`}
                    data-cursor="interactive"
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span
                      className={`mt-1 block text-sm ${
                        active ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <h3 className="mt-6 font-display text-lg tracking-tight sm:mt-8 sm:text-xl">
              3. Options
            </h3>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {quoteExtras.map((item) => {
                const active = extras.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleExtra(item.id)}
                    onMouseEnter={() => {
                      if (item.motion) setPreviewMotion(item.motion);
                    }}
                    className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-accent bg-accent text-white shadow-soft"
                        : "border-line text-muted"
                    }`}
                    data-cursor="interactive"
                    aria-pressed={active}
                  >
                    {active ? "✓ " : "+ "}
                    {item.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {previewMotion && (
                <motion.div
                  key={previewMotion}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 max-w-sm sm:mt-8"
                >
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    Aperçu motion — option sélectionnée
                  </p>
                  <FeatureMotion id={previewMotion} compact />
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>

          <Reveal delay={0.08} className="hidden lg:block">
            <div className="sticky top-24">{EstimateCard}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
