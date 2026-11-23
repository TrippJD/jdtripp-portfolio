import { navLinks, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" className="group flex items-center gap-3" aria-label="Back to top">
          <span className="grid size-9 place-items-center rounded-md border border-line bg-space/60 font-mono text-xs font-bold backdrop-blur transition-colors group-hover:border-signal group-hover:text-signal">
            JT
          </span>
          <span className="hidden font-mono text-xs tracking-[0.2em] text-haze uppercase sm:inline">
            {site.name.first} {site.name.last}
          </span>
        </a>

        <nav aria-label="Main">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-space/60 p-1 backdrop-blur">
            {navLinks.map((link) => (
              <li key={link.href} className={link.href === "#contact" ? "" : "hidden md:block"}>
                <a
                  href={link.href}
                  className={
                    link.href === "#contact"
                      ? "block rounded-full bg-signal px-4 py-2 text-sm font-medium text-space transition-colors hover:bg-paper"
                      : "block rounded-full px-4 py-2 text-sm text-haze transition-colors hover:text-paper"
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
