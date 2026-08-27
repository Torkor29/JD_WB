"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureMotion } from "@/components/FeatureMotion";
import { productCapabilities } from "@/lib/capabilities";
import { siteConfig } from "@/lib/site";

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
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-tight text-ink">
            Sites, apps et outils métiers — paiement, RDV, fidélité inclus.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Chaque aperçu ci-dessous montre une capacité produit réelle : ce que
            vos clients utilisent, pas une démo décorative.
          </p>
        </div>

        <div className="mt-12 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-2">
            {productCapabilities.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`w-full min-w-0 rounded-2xl border px-4 py-4 text-left transition sm:px-5 ${
                    isActive
                      ? "border-line bg-white shadow-soft"
                      : "border-transparent bg-transparent hover:border-line hover:bg-white/70"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
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
                        <h3 className="text-[15px] font-semibold tracking-tight text-ink sm:text-base">
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
                            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft sm:text-sm">
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
            <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white p-4 shadow-soft sm:p-5">
              <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  {current.previewLabel}
                </p>
                <span className="shrink-0 rounded-full bg-ink/[0.05] px-2.5 py-1 text-[10px] font-medium text-ink-soft">
                  Aperçu produit
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-line bg-paper-soft p-3 sm:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="min-w-0"
                  >
                    <FeatureMotion id={current.demo} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted sm:text-[13px]">
                {current.result}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
