import { PinnedStatement } from "@/components/style-check/pinned-statement";

// Temporary style-check page: shows the Flight log colors, type and a scroll
// animation. It gets replaced section by section as the real site is built.

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
      <section className="mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-6">
        <p className="eyebrow">[ T-minus 10 yrs ]</p>
        <h1 className="mt-6 text-7xl leading-[0.9] font-bold tracking-tighter md:text-[10rem]">
          Josh
          <br />
          <span className="text-signal">Tripp</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-haze md:text-xl">
          Senior full-stack developer and team lead
          <span className="ml-2 inline-block size-2 rounded-full bg-flare align-middle" />
        </p>
        <p className="mt-24 font-mono text-xs tracking-[0.2em] text-haze uppercase">
          Scroll to explore ↓
        </p>
      </section>

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
