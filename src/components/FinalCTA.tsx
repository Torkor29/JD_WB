"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "./Reveal";
import { siteConfig } from "@/lib/site";

export function FinalCTA() {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();

    const subject = encodeURIComponent(
      `Nouveau projet${name ? ` — ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      `Bonjour Julien,\n\n${project}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );

    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
    setStatus("ready");
  };

  return (
    <section id="contact" className="section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(31,94,255,0.12),transparent_55%)]"
      />
      <div className="container-site relative">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="headline mt-4 max-w-4xl text-display-xl">
            Alors, qu’est-ce qu’on
            <span className="text-accent"> construit&nbsp;?</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 sm:text-xl">
            Parlez-moi de votre projet, même s’il n’est encore qu’une idée.
            Réponse humaine, devis clair, prochaines étapes concrètes.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 sm:mt-12">
          <form
            onSubmit={onSubmit}
            className="grid gap-4 rounded-[1.35rem] border border-line bg-white p-4 shadow-card sm:rounded-[1.6rem] sm:p-6 md:grid-cols-2 md:p-8"
          >
            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Nom
              </span>
              <input
                name="name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-line bg-paper-soft px-4 py-3 outline-none transition focus:border-accent/50"
                placeholder="Votre nom"
              />
            </label>
            <label className="block md:col-span-1">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-line bg-paper-soft px-4 py-3 outline-none transition focus:border-accent/50"
                placeholder="vous@email.fr"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Votre projet
              </span>
              <textarea
                name="project"
                required
                rows={5}
                className="w-full resize-y rounded-xl border border-line bg-paper-soft px-4 py-3 outline-none transition focus:border-accent/50"
                placeholder="L’idée, le besoin, le contexte, le délai souhaité…"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 pt-2 md:col-span-2 sm:gap-4">
              <button type="submit" className="btn btn-primary w-full sm:w-auto" data-cursor="interactive">
                Envoyer mon projet
                <span aria-hidden>→</span>
              </button>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="link-underline text-sm font-semibold text-accent"
                data-cursor="interactive"
              >
                {siteConfig.contactEmail}
              </a>
              {status === "ready" && (
                <p className="text-sm text-accent">
                  Votre client mail va s’ouvrir avec le message préparé.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
