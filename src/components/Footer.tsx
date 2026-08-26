import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line pb-10 pt-14">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-2xl tracking-tight">
              Julien <span className="text-accent">DOLOU</span>
            </p>
            <p className="mt-3 max-w-sm text-mist">
              Développement & produits numériques sur mesure
            </p>
          </div>

          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-3 sm:justify-items-end">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-underline text-sm text-mist hover:text-ivory sm:text-right"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Julien DOLOU</p>
          <div className="flex flex-wrap gap-4">
            <a href="/mentions-legales" className="link-underline hover:text-ivory">
              Mentions légales
            </a>
            <span>{siteConfig.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
