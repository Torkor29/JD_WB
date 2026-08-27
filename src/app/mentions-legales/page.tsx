import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${siteConfig.name}.`,
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  const { legal, name, founder, contactEmail } = siteConfig;

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-ink md:py-24">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Retour
        </Link>
        <h1 className="mt-8 text-3xl font-medium tracking-tight md:text-4xl">
          Mentions légales
        </h1>

        <div className="mt-10 space-y-8 leading-relaxed text-muted">
          <section>
            <h2 className="text-xl text-ink">Éditeur</h2>
            <p className="mt-3">
              {name} — {founder}
              <br />
              {legal.status}
              <br />
              {legal.address}
              <br />
              SIREN : {legal.siren}
              <br />
              SIRET : {legal.siret}
              <br />
              TVA : {legal.tva}
              <br />
              Activité : {legal.activity}
              <br />
              Contact :{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
            </p>
          </section>
          <section>
            <h2 className="text-xl text-ink">Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé sur une infrastructure cloud (VPS). Pour toute
              question, contactez l’éditeur.
            </p>
          </section>
          <section>
            <h2 className="text-xl text-ink">Propriété intellectuelle</h2>
            <p className="mt-3">
              L’ensemble des contenus présents sur ce site est protégé. Toute
              reproduction non autorisée est interdite.
            </p>
          </section>
          <section>
            <h2 className="text-xl text-ink">Données personnelles</h2>
            <p className="mt-3">
              Les informations envoyées via le formulaire sont utilisées
              uniquement pour répondre à votre demande.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
