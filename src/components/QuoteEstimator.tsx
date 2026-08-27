"use client";

import { useMemo, useState } from "react";
import { Reveal } from "./Reveal";
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

export function QuoteEstimator() {
  const [type, setType] = useState<QuoteProjectType>("site-vitrine");
  const [scope, setScope] = useState<QuoteScope>("complet");
  const [extras, setExtras] = useState<string[]>(["design", "seo"]);

  const estimate = useMemo(
    () => estimateQuote(type, scope, extras),
    [type, scope, extras],
  );

  const toggleExtra = (id: string) => {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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

  return (
    <section id="devis" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Estimation</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Combien ça coûte&nbsp;?
            <span className="block text-accent">Voyons ça clairement.</span>
          </h2>
          <p className="lede mt-5">
            Une estimation indicative selon votre besoin. Le devis final se
            construit ensemble — sans mauvaise surprise.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="rounded-[1.5rem] border border-line bg-white p-6 shadow-card md:p-8">
            <h3 className="font-display text-xl tracking-tight">1. Type de projet</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {quoteProjectTypes.map((item) => {
                const active = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-accent bg-accent-soft shadow-soft"
                        : "border-line hover:border-accent/30"
                    }`}
                    data-cursor="interactive"
                  >
                    <span className="block font-semibold text-ink">{item.label}</span>
                    <span className="mt-1 block text-sm text-muted">{item.hint}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="mt-8 font-display text-xl tracking-tight">2. Niveau d’ambition</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {quoteScopes.map((item) => {
                const active = scope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScope(item.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-line hover:border-accent/30"
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

            <h3 className="mt-8 font-display text-xl tracking-tight">3. Options</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {quoteExtras.map((item) => {
                const active = extras.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleExtra(item.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-line text-muted hover:text-ink"
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
          </Reveal>

          <Reveal delay={0.08}>
            <div className="sticky top-24 rounded-[1.5rem] border border-line bg-ink p-7 text-white shadow-lift md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-mist">
                Estimation indicative
              </p>
              <p className="mt-5 font-display text-4xl tracking-tight md:text-5xl">
                {formatEuro(estimate.min)}
                <span className="mx-2 text-white/40">–</span>
                {formatEuro(estimate.max)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Fourchette approximative selon vos choix. Chaque projet est
                unique : on affine ensemble après un échange.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                <li>• Conception & développement inclus</li>
                <li>• Un seul interlocuteur du début à la fin</li>
                <li>• Devis précis après cadrage du besoin</li>
              </ul>
              <a
                href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
                  "Demande de devis — estimation site",
                )}&body=${mailBody}`}
                className="btn btn-primary mt-8 w-full"
                data-cursor="interactive"
              >
                Recevoir un devis précis
                <span aria-hidden>→</span>
              </a>
              <a
                href="#contact"
                className="mt-4 inline-flex w-full justify-center text-sm font-semibold text-accent-mist underline-offset-4 hover:underline"
              >
                Ou décrire mon projet ici
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
