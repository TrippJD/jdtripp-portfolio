import { footer, navLinks, site } from "@/content/site";
import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <a href="#top" className="group inline-flex items-center gap-3" aria-label="Back to top">
            <span className="grid size-10 place-items-center rounded-md border border-line font-mono text-xs font-bold transition-colors group-hover:border-signal group-hover:text-signal">
              JT
            </span>
            <span className="text-lg font-bold tracking-tight">
              {site.name.first} {site.name.last}
            </span>
          </a>
          <p className="mt-4 max-w-xs leading-relaxed text-haze">{footer.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-xs tracking-[0.15em] text-signal uppercase">Navigate</p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-haze transition-colors hover:text-paper">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs tracking-[0.15em] text-signal uppercase">Elsewhere</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-haze transition-colors hover:text-paper"
              >
                LinkedIn <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-haze transition-colors hover:text-paper"
              >
                GitHub <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 font-mono text-xs tracking-[0.1em] text-haze uppercase">
          <p>
            © <CurrentYear /> {site.name.first} {site.name.last}
          </p>
          <p>{footer.signoff}</p>
          <a href="#top" className="transition-colors hover:text-signal">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
