import { Hero } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header";
import { PinnedStatement } from "@/components/style-check/pinned-statement";

// Below the hero is still the temporary style check (colors, type and a scroll
// demo). It gets replaced section by section as the real site is built.

const colors = [
  { name: "space", hex: "#0A0F1C", role: "Background", className: "bg-space" },
  { name: "space-2", hex: "#111829", role: "Raised surface", className: "bg-space-2" },
  { name: "line", hex: "#26304A", role: "Borders", className: "bg-line" },
  { name: "paper", hex: "#E8ECF2", role: "Text", className: "bg-paper" },
  { name: "haze", hex: "#8A94A8", role: "Muted text", className: "bg-haze" },
  { name: "signal", hex: "#3D7BFF", role: "Accent", className: "bg-signal" },
  { name: "flare", hex: "#FF7A2F", role: "Highlight", className: "bg-flare" },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="eyebrow">[ Palette ]</p>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {colors.map((color) => (
            <li key={color.name}>
              <div className={`aspect-square rounded-xl border border-line ${color.className}`} />
              <p className="mt-3 font-mono text-sm">{color.name}</p>
              <p className="font-mono text-xs text-haze">
                {color.hex} · {color.role}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 border-t border-line px-6 py-24">
        <p className="eyebrow">[ Type ]</p>
        <p className="text-6xl font-bold tracking-tighter md:text-8xl">Display, Space Grotesk</p>
        <p className="text-3xl font-medium tracking-tight md:text-5xl">
          Section heading for each part of the story
        </p>
        <p className="max-w-2xl text-lg leading-relaxed text-haze">
          Body text. Ten years of building web applications end to end, from React front ends to
          Node.js and Express APIs backed by SQL, MongoDB and Redis.
        </p>
        <p className="font-mono text-sm text-haze">
          Space Mono for labels, stats and little technical details. 0123456789
        </p>
      </section>

      <PinnedStatement />

      <section className="flex min-h-[60svh] items-center justify-center px-6">
        <p className="font-mono text-sm text-haze">[ End of style check ]</p>
      </section>
    </main>
  );
}
