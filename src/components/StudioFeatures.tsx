"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureMotion } from "@/components/FeatureMotion";
import { productCapabilities } from "@/lib/capabilities";
import { siteConfig } from "@/lib/site";

function PreviewCard({
  previewLabel,
  result,
  demoId,
  capabilityId,
}: {
  previewLabel: string;
  result: string;
  demoId: (typeof productCapabilities)[number]["demo"];
  capabilityId: string;
}) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-line bg-white p-3.5 shadow-soft sm:rounded-[1.5rem] sm:p-5">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          {previewLabel}
        </p>
        <span className="shrink-0 rounded-full bg-ink/[0.05] px-2.5 py-1 text-[10px] font-medium text-ink-soft">
          Aperçu produit
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-paper-soft p-3 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={capabilityId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <FeatureMotion id={demoId} />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-muted sm:text-[13px]">
        {result}
      </p>
    </div>
  );
}

export function StudioFeatures() {
  const [active, setActive] = useState(0);
  const current = productCapabilities[active];

  return (
    <section id="services" className="border-t border-line bg-paper">
      <div className="container-site section-pad">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Ce que {siteConfig.name} construit
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.12] tracking-tight text-ink">
            Sites, apps et outils métiers — paiement, RDV, fidélité inclus.
          </h2>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
            Chaque aperçu montre une capacité produit réelle : ce que vos
            clients utilisent.
          </p>
        </div>

        {/* —— Mobile / tablet : chips + aperçu —— */}
        <div className="mt-8 lg:hidden">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-none">
            {productCapabilities.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${
                    selected
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink"
                  }`}
                  aria-pressed={selected}
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            {current.description}
          </p>

          <div className="mt-4 min-w-0">
            <PreviewCard
              previewLabel={current.previewLabel}
              result={current.result}
              demoId={current.demo}
              capabilityId={current.id}
            />
          </div>
        </div>

        {/* —— Desktop : liste + aperçu sticky —— */}
        <div className="mt-12 hidden min-w-0 gap-10 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="min-w-0 space-y-2">
            {productCapabilities.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`w-full min-w-0 rounded-2xl border px-5 py-4 text-left transition ${
                    isActive
                      ? "border-line bg-white shadow-soft"
                      : "border-transparent bg-transparent hover:border-line hover:bg-white/70"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        isActive
                          ? "bg-ink text-paper"
                          : "bg-ink/[0.06] text-muted"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold tracking-tight text-ink">
                          {item.title}
                        </h3>
                        <span className="rounded-full bg-ink/[0.05] px-2 py-0.5 text-[10px] font-medium text-muted">
                          {item.tag}
                        </span>
                      </div>
                      <AnimatePresence initial={false}>
                        {isActive ? (
                          <motion.div
                            key="desc"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                              {item.description}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <PreviewCard
              previewLabel={current.previewLabel}
              result={current.result}
              demoId={current.demo}
              capabilityId={current.id}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
