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
    <main className="min-h-screen px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="link-underline text-sm text-muted hover:text-ink">
          ← Retour
        </Link>
        <h1 className="headline mt-8 text-display-md">Mentions légales</h1>

        <div className="mt-10 space-y-8 text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-ink">Éditeur</h2>
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
              <a href={`mailto:${contactEmail}`} className="text-accent">
                {contactEmail}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Hébergement</h2>
            <p className="mt-3">
              Les informations d’hébergement seront précisées lors de la mise en
              production du site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Propriété intellectuelle</h2>
            <p className="mt-3">
              L’ensemble des contenus présents sur ce site (textes, éléments
              graphiques, structure) est protégé. Toute reproduction non
              autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Données personnelles</h2>
            <p className="mt-3">
              Les messages envoyés via le formulaire de contact sont transmis par
              e-mail et ne sont pas stockés sur ce site. Pour toute demande
              relative à vos données, contactez{" "}
              <a href={`mailto:${contactEmail}`} className="text-accent">
                {contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
