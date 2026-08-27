import { siteConfig } from "@/lib/site";

export function FooterCinematic() {
  return (
    <footer className="border-t border-white/10 bg-black pb-10 pt-12">
      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-medium tracking-tight text-primary-soft">
              Julien <span className="text-primary/60">DOLOU</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Studio digital — sites, apps & outils métiers. Depuis Brest, bord
              de mer.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-gray-400">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </a>
            ))}
            <a href="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </a>
          </nav>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-gray-600">
          © {new Date().getFullYear()} Julien DOLOU — {siteConfig.location}
        </p>
      </div>
    </footer>
  );
}
