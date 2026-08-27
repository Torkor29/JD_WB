import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site de ${siteConfig.name}.`,
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  const { legal, name, contactEmail } = siteConfig;

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-primary-soft md:py-24">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-primary">
          ← Retour
        </Link>
        <h1 className="mt-8 text-3xl font-medium tracking-tight md:text-4xl">
          Mentions légales
        </h1>

        <div className="mt-10 space-y-8 leading-relaxed text-gray-400">
          <section>
            <h2 className="text-xl text-primary-soft">Éditeur</h2>
            <p className="mt-3">
              {name}
              <br />
              {legal.status}
              <br />
              {legal.address}
              <br />
              SIREN : {legal.siren}
              <br />
              SIRET : {legal.siret}
              <br />
              TVA intracommunautaire : {legal.tva}
              <br />
              Activité : {legal.activity}
              <br />
              Contact :{" "}
              <a href={`mailto:${contactEmail}`} className="text-primary underline-offset-4 hover:underline">
                {contactEmail}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl text-primary-soft">Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé sur une infrastructure cloud (VPS). Pour toute
              question technique liée à l’hébergement, contactez l’éditeur à
              l’adresse ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-primary-soft">Propriété intellectuelle</h2>
            <p className="mt-3">
              L’ensemble des contenus présents sur ce site (textes, visuels,
              code) est protégé. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-primary-soft">Données personnelles</h2>
            <p className="mt-3">
              Les informations envoyées via le formulaire de contact sont
              utilisées uniquement pour répondre à votre demande. Aucune donnée
              n’est revendue.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
