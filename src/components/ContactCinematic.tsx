"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "./WordsPullUp";
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
      `Bonjour,\n\n${project}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
    setStatus("ready");
  };

  return (
    <section
      id="contact"
      className="section-pad relative overflow-hidden bg-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_0%,rgba(31,94,255,0.08),transparent_55%)]"
      />
      <div className="container-site relative">
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent sm:text-xs">
          Contact
        </p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-ink">
          <WordsPullUp text="Alors, on construit ?" />
        </h2>
        <p className="mt-5 max-w-xl text-sm text-muted md:text-base">
          Site, app, paiement, RDV… Décrivez le besoin. Réponse humaine, devis
          clair.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 grid min-w-0 gap-4 overflow-hidden rounded-[1.5rem] border border-line bg-paper-soft p-5 shadow-card sm:p-8 md:grid-cols-2"
        >
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-muted">
              Nom
            </span>
            <input
              name="name"
              required
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-accent/40"
              placeholder="Votre nom"
            />
          </label>
          <label className="block">
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
          <label className="block md:col-span-2">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-muted">
              Votre projet
            </span>
            <textarea
              name="project"
              required
              rows={5}
              className="w-full resize-y rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-accent/40"
              placeholder="L’idée, le besoin, le contexte…"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <button
              type="submit"
              className="group inline-flex items-center gap-2 rounded-full bg-ink py-2 pl-5 pr-1.5 text-sm font-medium text-white transition hover:gap-3"
            >
              Envoyer mon projet
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent transition group-hover:scale-110">
                <ArrowRight size={14} className="text-white" />
              </span>
            </button>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-accent underline-offset-4 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
            {status === "ready" && (
              <p className="text-sm text-accent">Votre client mail va s’ouvrir.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
