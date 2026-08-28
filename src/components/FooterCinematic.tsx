import { siteConfig } from "@/lib/site";

export function FooterCinematic() {
  return (
    <footer className="border-t border-line bg-paper-soft pb-10 pt-12">
      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-medium tracking-tight text-ink">
              Ti<span className="text-accent">Code</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Agence digitale — sites, apps & outils métiers. Fondée par Julien.
              Depuis Brest, bord de mer.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-muted">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-ink">
                {item.label}
              </a>
            ))}
            <a href="/mentions-legales" className="hover:text-ink">
              Mentions légales
            </a>
          </nav>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name} — Julien —{" "}
          {siteConfig.location}
        </p>
      </div>
    </footer>
  );
}
